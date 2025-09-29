import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
//
@Injectable()
export class ImageService {

  async saveBase64Image(base64File: string): Promise<string> {
    try {
      if (!base64File) throw new Error('No se recibió el archivo base64');

      const base64Data = this.cleanBase64(base64File);
      const buffer = this.base64ToBuffer(base64Data);
      const filePath = await this.saveImage(buffer);

      console.log('✅ Imagen guardada en:', path.resolve(filePath));

      // 💡 Aquí convertimos la ruta interna a una URL pública
      const fileName = path.basename(filePath); // Extrae solo el nombre del archivo
      const publicPath = `http://localhost:3000/uploads/${fileName}`; // 🌐 URL pública de la imagen

      console.log('🌐 URL pública de la imagen:', publicPath);
      return publicPath;

    } catch (error) {
      console.error('❌ Error al procesar la imagen base64:', error.message);
      throw new Error('Error al procesar la imagen base64: ' + error.message);
    }
  }

  private cleanBase64(base64File: string): string {
    return base64File.replace(/^data:image\/\w+;base64,/, '');
  }

  private base64ToBuffer(base64Data: string): Buffer {
    return Buffer.from(base64Data, 'base64');
  }

  private async saveImage(buffer: Buffer): Promise<string> {
    try {
      const fileName = `image_${Date.now()}.png`; 
      const uploadsDir = path.join(process.cwd(), 'uploads'); 

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);

      return filePath;

    } catch (error) {
      console.error('❌ Error al guardar la imagen:', error.message);
      throw new Error('Error al guardar la imagen: ' + error.message);
    }
  }
}
