import genanki
import random
import json
import os
import google.generativeai as genai

from utils.utils import formatear_palabra_con_articulo, generar_info_genero, obtener_tipo_y_color
from dotenv import load_dotenv

# Cargar variables desde .env
load_dotenv()

DEEPL_API_KEY = os.getenv('DEEPL_API_KEY')

modelo_tarjeta = genanki.Model(
    random.randrange(1 << 30, 1 << 31),
    'Modelo Alemán Bidireccional',
    fields=[
        {'name': 'PalabraAleman'},
        {'name': 'PalabraEspanol'},
        {'name': 'Tipo'},
        {'name': 'EjemploAleman'},
        {'name': 'EjemploEspanol'},
        {'name': 'Color'},
        {'name': 'InfoGenero'},
    ],
    templates=[
        # ... (Tus plantillas 'Alemán → Español' y 'Español → Alemán' van aquí, sin cambios) ...
        {
            'name': 'Alemán → Español',
            'qfmt': '''<div style="font-size: 32px; text-align: center; color: {{Color}}; font-weight: bold; margin-bottom: 10px;">
                {{PalabraAleman}}
            </div>
            <div style="font-size: 14px; text-align: center; color: #666; margin-top: 15px;">
                <span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 3px;">{{Tipo}}</span>
                {{InfoGenero}}
            </div>
            <div style="font-size: 16px; text-align: center; color: #fff; margin-top: 20px; font-style: italic;">
                {{EjemploAleman}}
            </div>''',
            'afmt': '''{{FrontSide}}
                <hr id="answer">
                <div style="font-size: 24px; text-align: center; margin: 15px 0;">
                    <b>{{PalabraEspanol}}</b>
                </div>
                <div style="font-size: 16px; text-align: center; color: #fff; font-style: italic;">
                    {{EjemploEspanol}}
                </div>''',
        },
        {
            'name': 'Español → Alemán',
            'qfmt': '''<div style="font-size: 32px; text-align: center; font-weight: bold; margin-bottom: 10px;">
                {{PalabraEspanol}}
            </div>
            <div style="font-size: 14px; text-align: center; color: #666; margin-top: 15px;">
                <span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 3px;">{{Tipo}}</span>
            </div>
            <div style="font-size: 16px; text-align: center; color: #444; margin-top: 20px; font-style: italic;">
                {{EjemploEspanol}}
            </div>''',
            'afmt': '''{{FrontSide}}
                <hr id="answer">
                <div style="font-size: 24px; text-align: center; color: {{Color}}; margin: 15px 0;">
                    <b>{{PalabraAleman}}</b>
                </div>
                <div style="font-size: 14px; text-align: center; color: #666;">
                    {{InfoGenero}}
                </div>
                <div style="font-size: 16px; text-align: center; color: #555; font-style: italic;">
                    {{EjemploAleman}}
                </div>''',
        },
    ])

# --- Configuración de Gemini (Igual que antes) ---
try:
    genai.configure(api_key=DEEPL_API_KEY)
except KeyError:
    print("Error: La variable de entorno GEMINI_API_KEY no está configurada.")
    exit()

generation_config = {
    "response_mime_type": "application/json",
}
model = genai.GenerativeModel(
    "models/gemini-flash-latest",
    generation_config=generation_config
)

# --- Modelo Anki y Funciones de Ayuda (Igual que antes) ---
# (Aquí irían modelo_tarjeta, obtener_tipo_y_color, 
# formatear_palabra_con_articulo, generar_info_genero)
# ... (copiadas de la respuesta anterior) ...

# --- NUEVA Función de Prompt (para Lotes) ---
def crear_prompt_para_lote(lote_palabras):
    palabras_str = ", ".join([f'"{palabra}"' for palabra in lote_palabras])
    return f"""
    Eres un experto lingüista alemán-español creando datos para tarjetas de estudio (flashcards).
    Analiza CADA UNA de las palabras en la siguiente lista: [ {palabras_str} ]

    Las palabras pueden estar ya conjugadas, declinadas o con diferente genero o numero. Quiero que las conviertas en la forma 
    mas basica o infinitivo siempre. Puedes usar la palabra modificada o conjugada en la frase de ejemplo.

    Devuelve un array JSON, donde cada objeto del array corresponde a una palabra de la lista
    y sigue la estructura JSON exacta definida a continuación.
    
    Asegúrate de incluir un objeto JSON por cada palabra de la lista de entrada.

    La estructura para CADA objeto debe ser:
    {{
      "palabra_de": "La palabra original (capitalizada si es sustantivo, si no minúscula)",
      "palabra_es": "La traducción principal al español",
      "pos": "La etiqueta POS (ej: NOUN)",
      "genero": "El género (ej: Neut, Fem o Masc)",
      "articulo": "El artículo (ej: das)",
      "plural": "La forma plural (ej: Häuser)",
      "ejemplo_de": "Una frase de ejemplo en alemán.",
      "ejemplo_es": "La traducción de la frase de ejemplo."
    }}

    Proporciona únicamente el array JSON válido que contenga todos los objetos.
    """

# --- NUEVA Función de Ayuda para crear lotes ---
def crear_lotes(lista_completa, tamano_lote):
    """Divide una lista en lotes más pequeños."""
    for i in range(0, len(lista_completa), tamano_lote):
        yield lista_completa[i:i + tamano_lote]

# --- Lógica Principal (Refactorizada para Lotes) ---

def procesar_palabras(lista_palabras, nombre_deck='Vocabulario Alemán', tamano_lote=10):
    
    deck_id = random.randrange(1 << 30, 1 << 31)
    deck = genanki.Deck(deck_id, nombre_deck)
    
    # 1. Agrupar la lista de palabras en lotes
    lotes = list(crear_lotes(lista_palabras, tamano_lote))
    num_lotes = len(lotes)
    
    print(f"Dividiendo {len(lista_palabras)} palabras en {num_lotes} lotes de {tamano_lote}...")

    for i, lote in enumerate(lotes):
        print(f"\n--- Procesando Lote {i+1}/{num_lotes} ---")
        print(f"  Palabras: {', '.join(lote)}")
        
        try:
            # 2. Crear el prompt para el lote completo
            prompt = crear_prompt_para_lote(lote)
            
            # 3. Llamar a la API UNA VEZ para el lote
            response = model.generate_content(prompt)
            
            # 4. La respuesta es un array JSON
            lista_de_datos = json.loads(response.text)
            
            if len(lista_de_datos) != len(lote):
                print(f"  ⚠️ Advertencia: El lote esperaba {len(lote)} palabras pero Gemini devolvió {len(lista_de_datos)}.")

            # 5. Iterar sobre los resultados del lote
            for datos in lista_de_datos:
                # 6. Derivar los 7 campos (igual que antes)
                palabra_formato = formatear_palabra_con_articulo(datos)
                traduccion = datos.get('palabra_es', 'Error')
                tipo, color = obtener_tipo_y_color(datos)
                ejemplo_aleman = datos.get('ejemplo_de', 'Error')
                ejemplo_espanol = datos.get('ejemplo_es', 'Error')
                info_genero = generar_info_genero(datos)
                
                print(f"    → Procesado: {palabra_formato} ({tipo})")

                # 7. Crear la nota (igual que antes)
                nota = genanki.Note(
                    model=modelo_tarjeta,
                    fields=[
                        palabra_formato,      # PalabraAleman
                        traduccion,           # PalabraEspanol
                        tipo,                 # Tipo
                        ejemplo_aleman,       # EjemploAleman
                        ejemplo_espanol,      # EjemploEspanol
                        color,                # Color
                        info_genero           # InfoGenero
                    ]
                )
                deck.add_note(nota)
                
        except Exception as e:
            print(f"❌ Error al procesar el lote {i+1} ({lote}): {e}")
            print("   Este lote completo se saltará.")

    return deck
