# Desplegar Expert Hub V2

Expert Hub V2 reutiliza el servicio estable existente. El Dockerfile raiz construye V2 con el mismo contrato de ejecucion que ya usa Dokploy.

## Configuracion existente

| Campo | Valor |
|---|---|
| Repositorio | `Anthcent/CatalogoAI` |
| Rama | `main` |
| Contexto de construccion | `/` |
| Dockerfile | `/Dockerfile` |
| Puerto interno | `8080` |
| Base de datos | `DATABASE_URL` existente |
| Volumen persistente | `/app/uploads` |

`GEMINI_API_KEY`, `GEMINI_MODEL` y `GEMINI_EMBEDDING_MODEL` se heredan del servicio existente. V2 no ejecuta migraciones: usa el esquema PostgreSQL administrado por la aplicacion original.

## Verificacion posterior

1. Comprueba que `/login` abre y acepta el usuario existente.
2. Crea un elemento, edita el lienzo y confirma que aparece una version.
3. Sube un archivo y reinicia el servicio para comprobar su persistencia en `/app/uploads`.
4. Busca el elemento y valida Gemini cuando la clave este configurada.

El contenedor escucha en `0.0.0.0:8080`, se ejecuta como usuario no privilegiado y comprueba `http://127.0.0.1:8080/`.
