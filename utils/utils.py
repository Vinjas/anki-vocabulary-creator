import genanki

def obtener_tipo_y_color(datos_gemini):
    """Extrae el tipo y color desde los datos de Gemini."""
    pos = datos_gemini.get('pos', 'UNK')
    genero = datos_gemini.get('genero', 'N/A')

    # Mapeo de tipos y colores (basado en tu script original)
    tipo_map = {
        'NOUN': 'Sustantivo',
        'VERB': 'Verbo',
        'ADJ': 'Adjetivo',
        'ADV': 'Adverbio',
        'PRON': 'Pronombre',
        'ADP': 'Preposición',
        'CONJ': 'Conjunción',
        'DET': 'Determinante',
    }
    color_map = {
        'NOUN': None,  # Se determina por género
        'VERB': '#FF8C00',  # Naranja
        'ADJ': '#9370DB',  # Púrpura
        'ADV': '#20B2AA',  # Turquesa
        'PRON': '#DAA520',  # Dorado
        'ADP': '#CD5C5C',  # Rojo indio
        'CONJ': '#708090',  # Gris pizarra
        'DET': '#8B4513',  # Marrón
    }
    
    tipo = tipo_map.get(pos, pos)
    color = color_map.get(pos, '#808080')
    
    # Lógica de color para sustantivos (basada en tu script original)
    if pos == 'NOUN':
        if genero == 'Masc':
            color = "#3F7DDA"  # Azul
        elif genero == 'Fem':
            color = '#FF69B4'  # Rosa
        elif genero == 'Neut':
            color = '#32CD32'  # Verde
        else:
            color = '#808080' # Gris por si falla
    
    return tipo, color

def formatear_palabra_con_articulo(datos_gemini):
    """Formatea la palabra alemana con su artículo si es un sustantivo."""
    if (datos_gemini.get('pos') == 'NOUN' and 
        datos_gemini.get('articulo') != 'N/A'):
        # Gemini ya debería devolver la palabra capitalizada si es sustantivo
        return f"{datos_gemini['articulo']} {datos_gemini['palabra_de']}"
    
    return datos_gemini.get('palabra_de', 'Error')

def generar_info_genero(datos_gemini):
    """Genera el HTML de info de género desde los datos de Gemini."""
    if (datos_gemini.get('pos') == 'NOUN' and 
        datos_gemini.get('genero') != 'N/A'):
        
        genero = datos_gemini['genero']
        
        genero_map = {
            'Masc': ('masculino', '♂️'),
            'Fem': ('femenino', '♀️'),
            'Neut': ('neutro', '⚪')
        }
        
        if genero in genero_map:
            nombre, emoji = genero_map[genero]
            return f'<span style="margin-left: 10px;">{emoji} {nombre.capitalize()}</span>'
    
    return ''

def crear_paquete(deck, nombre_archivo='mi_deck_aleman.apkg'):
    """Crea el archivo .apkg (sin cambios)"""
    paquete = genanki.Package(deck)
    paquete.write_to_file(nombre_archivo)
    print(f"\n✅ Deck creado exitosamente: {nombre_archivo}")
    