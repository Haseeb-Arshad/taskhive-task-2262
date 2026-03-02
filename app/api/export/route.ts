import { NextRequest, NextResponse } from 'next/server';
import { json2csv } from 'json-2-csv';
import { PDFDocument } from 'pdfkit';
import { Blob } from 'buffer';

export async function POST(request: NextRequest) {
  const { filename, data, format } = await request.json();

  try {
    let response: Response;
    let contentType: string;

    switch (format) {
      case 'csv':
        const csv = await json2csv(data, {
          emptyFieldValue: '',
          excelBOM: true,
          delimiter: {
            field: ',',
            wrap: '"',
            eof: '\n'
          }
        });
        
        response = new Response(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`
          }
        });
        contentType = 'text/csv';
        break;

      case 'json':
        response = new Response(JSON.stringify(data, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${filename}"`
          }
        });
        contentType = 'application/json';
        break;

      case 'pdf':
        const pdfDoc = new PDFDocument();
        const chunks: Uint8Array[] = [];
        
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        
        pdfDoc.fontSize(12).text('Calculation History', {
          align: 'center',
          underline: true
        });
        
        pdfDoc.moveDown();
        
        data.forEach((item: any, index: number) => {
          pdfDoc.fontSize(10).text(`${index + 1}. ${item.expression} = ${item.result}`, {
            marginBottom: 5
          });
        });
        
        pdfDoc.end();
        
        const pdfBuffer = await new Promise<Buffer>(resolve => {
          pdfDoc.on('end', () => {
            const pdfData = Buffer.concat(chunks);
            resolve(pdfData);
          });
        });
        
        response = new Response(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`
          }
        });
        contentType = 'application/pdf';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid format' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { 
        success: true, 
        contentType,
        filename 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      error: 'Export requires POST request with data', 
      formats: ['csv', 'json', 'pdf'] 
    },
    { status: 405 }
  );
}