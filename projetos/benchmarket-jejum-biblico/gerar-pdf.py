#!/usr/bin/env python3
"""
Script para converter BENCHMARKET-COMPLETO.html para PDF
Usa WeasyPrint para renderização profissional
"""

import sys
from pathlib import Path
from weasyprint import HTML, CSS

def convert_html_to_pdf():
    """Converte HTML para PDF"""
    
    # Paths
    html_file = Path("/workspaces/aios-core/projetos/benchmarket-jejum-biblico/BENCHMARKET-COMPLETO.html")
    pdf_file = Path("/workspaces/aios-core/projetos/benchmarket-jejum-biblico/BENCHMARKET-JEJUM-BIBLICO.pdf")
    
    if not html_file.exists():
        print(f"❌ Erro: Arquivo {html_file} não encontrado!")
        return False
    
    try:
        print(f"📄 Convertendo HTML → PDF...")
        print(f"   Entrada: {html_file.name}")
        
        # Gerar PDF com WeasyPrint
        HTML(str(html_file)).write_pdf(
            str(pdf_file),
            optimize_size=('images', 'fonts'),
        )
        
        # Verificar arquivo criado
        file_size = pdf_file.stat().st_size
        file_size_mb = file_size / (1024 * 1024)
        
        print(f"\n✅ PDF Gerado com Sucesso!")
        print(f"   Saída: {pdf_file.name}")
        print(f"   Tamanho: {file_size_mb:.2f} MB ({file_size:,} bytes)")
        print(f"   Localização: {pdf_file}")
        print(f"\n🎉 PDF pronto para télécarregar!")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro na conversão: {str(e)}")
        return False

if __name__ == "__main__":
    success = convert_html_to_pdf()
    sys.exit(0 if success else 1)
