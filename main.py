import sys

from utils.file_parser import (
    encontrar_archivos_txt,
    procesar_archivo, 
)

def main():
    """Función principal del script"""
    print("=" * 70)
    print("🎴 GENERADOR AUTOMÁTICO DE DECKS ANKI - ALEMÁN")
    print("=" * 70)
    print()

    print("🔍 Buscando archivos .txt en la carpeta actual...")
    archivos_txt = encontrar_archivos_txt()
    
    if not archivos_txt:
        print("❌ No se encontraron archivos .txt para procesar")
        print()
        print("💡 Instrucciones:")
        print("   1. Crea un archivo .txt con tus palabras (una por línea)")
        print("   2. Guárdalo en la misma carpeta que este script")
        print("   3. Ejecuta nuevamente: python main.py")
        print()
        print("📝 Ejemplo de archivo 'mis_palabras.txt':")
        print("   Haus")
        print("   lernen")
        print("   schön")
        sys.exit(0)

    print(f"✅ Se encontraron {len(archivos_txt)} archivo(s) .txt:")
    for archivo in archivos_txt:
        print(f"   • {archivo.name}")
    print()

    # Procesar cada archivo
    exitosos = 0
    fallidos = 0
    
    for archivo in archivos_txt:
        if procesar_archivo(archivo):
            exitosos += 1
        else:
            fallidos += 1
 
    print("\n" + "=" * 70)
    print("📊 RESUMEN FINAL")
    print("=" * 70)
    print(f"✅ Archivos procesados exitosamente: {exitosos}")
    if fallidos > 0:
        print(f"❌ Archivos con errores: {fallidos}")
    print()
    
    if exitosos > 0:
        print("📱 Próximos pasos:")
        print("   1. Abre Anki")
        print("   2. Ve a 'Archivo' → 'Importar'")
        print("   3. Selecciona los archivos .apkg generados")
        print("   4. ¡Empieza a estudiar!")

    print("\n" + "=" * 70)

if __name__ == "__main__":
    main()