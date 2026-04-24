import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No hay archivo' }, { status: 400 });
    }
    
    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 });
    }
    
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Archivo muy grande (max 5MB)' }, { status: 400 });
    }
    
    // Crear carpeta si no existe
    const uploadDir = path.join(process.cwd(), 'public', 'productos');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Generar nombre único
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    
    // Guardar archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, filename), buffer);
    
    return NextResponse.json({
      success: true,
      url: `/productos/${filename}`,
      filename,
    });
  } catch (error) {
    console.error('Error upload:', error);
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
  }
}