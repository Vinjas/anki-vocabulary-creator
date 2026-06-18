#!/usr/bin/env python3

import sys
import os
from pathlib import Path

# Importar las funciones del módulo principal
from utils.deck_creator_gemini import (
    procesar_palabras
)

from utils.utils import (
    crear_paquete
)

def leer_palabras_desde_archivo(ruta_archivo):
    """Lee palabras desde un archivo .txt, una por línea"""
    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            # Leer líneas, eliminar espacios y líneas vacías
            palabras = [linea.strip() for linea in f.readlines()]
            palabras = [p for p in palabras if p and not p.startswith('#')]
            return palabras
    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo '{ruta_archivo}'")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error al leer el archivo: {e}")
        sys.exit(1)

def encontrar_archivos_txt():
    """Encuentra todos los archivos .txt en la carpeta actual"""
    archivos = list(Path('.').glob('*.txt'))
    # Filtrar archivos que no queremos procesar
    archivos_excluidos = {'readme.txt', 'leeme.txt', 'instrucciones.txt'}
    archivos = [f for f in archivos if f.name.lower() not in archivos_excluidos]
    return archivos

def procesar_archivo(archivo_txt):
    """Procesa un archivo .txt y genera el deck correspondiente"""
    nombre_archivo = archivo_txt.name
    nombre_base = archivo_txt.stem
    
    print("\n" + "=" * 70)
    print(f"📄 PROCESANDO: {nombre_archivo}")
    print("=" * 70)
    
    # Leer palabras
    print(f"📖 Leyendo palabras del archivo...")
    palabras = leer_palabras_desde_archivo(archivo_txt)
    
    if palabras is None:
        return False
    
    if not palabras:
        print(f"⚠️  El archivo '{nombre_archivo}' no contiene palabras válidas")
        print("   El archivo NO será eliminado por seguridad")
        return False
    
    print(f"✅ Se encontraron {len(palabras)} palabras")
    
    # Mostrar las primeras 5 palabras
    print(f"\n📝 Primeras palabras:")
    for i, palabra in enumerate(palabras[:5], 1):
        print(f"   {i}. {palabra}")
    if len(palabras) > 5:
        print(f"   ... y {len(palabras) - 5} más")
    print()
    
    # Determinar nombre del deck y archivo de salida
    nombre_deck = f"Mis Palabras en Aleman"
    archivo_salida = f"MiDeckAleman.apkg"

    print("\n📚 ¿Cómo quieres llamar este deck?")
    nombre_deck_input = input("   Nombre del deck (Enter para usar nombre por defecto): ").strip()
    
# Si el usuario no introduce nada, usar nombre por defecto
    if nombre_deck_input:
        nombre_deck = nombre_deck_input
        # Crear nombre de archivo basado en el input del usuario
        # Reemplazar espacios por guiones bajos y quitar caracteres especiales
        archivo_base = nombre_deck.replace(' ', '_').replace('/', '_').replace('\\', '_')
        archivo_salida = f"{archivo_base}.apkg"
    else:
        nombre_deck = nombre_base.replace('_', ' ').title()
        archivo_salida = f"{nombre_base}.apkg"

    print(f"📚 Nombre del deck: {nombre_deck}")
    print(f"📦 Archivo salida:  {archivo_salida}")
    print()
    
    # Procesar palabras
    print("🔄 Procesando palabras...")
    print("-" * 70)
    
    try:
        deck = procesar_palabras(palabras, nombre_deck)
    except Exception as e:
        print(f"\n❌ Error durante el procesamiento: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("-" * 70)
    print()
    
    # Crear paquete
    print("💾 Creando archivo .apkg...")
    try:
        crear_paquete(deck, archivo_salida)
    except Exception as e:
        print(f"❌ Error al crear el paquete: {e}")
        return False
    
    # Resumen
    print()
    print("✅ COMPLETADO!")
    print(f"   • Palabras procesadas: {len(palabras)}")
    print(f"   • Tarjetas generadas:  {len(palabras) * 2} (bidireccional)")
    print(f"   • Archivo creado:      {archivo_salida}")
    
    return True