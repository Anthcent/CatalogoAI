# Desplegar Expert Hub V2

La V2 se despliega como segundo servicio sin reemplazar la aplicación estable.

## Hexper Ops / Dokploy

| Campo | Valor |
|---|---|
| Repositorio | `Anthcent/CatalogoAI` |
| Rama | `main` |
| Contexto de construcción | `/` |
| Dockerfile | `/expert_hub_v2/Dockerfile` |
| Puerto interno | `8080` |
| Base de datos | No, durante la fase visual aislada |

El contenedor escucha en `0.0.0.0:8080`, ejecuta como usuario no privilegiado y comprueba `http://127.0.0.1:8080/`.

Cuando Hexper Ops entregue la URL, configúrala en el servicio estable:

```text
EXPERT_HUB_V2_URL=https://url-asignada-a-la-v2
```

El botón `Abrir Expert Hub V2` del login comenzará a redirigir a ese servicio.
