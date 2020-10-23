export interface ContentType<S extends string = string> {
  accepts(mediaType: string): boolean;
}

export class JsonC implements ContentType<"JSON"> {
  accepts(mediaType: string): boolean {
    return /application\/json/.test(mediaType);
  }
}

export const Json = new JsonC();
