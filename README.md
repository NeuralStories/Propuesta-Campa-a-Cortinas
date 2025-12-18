# 🪟✨ CortinasExpress Configurator

![React](https://img.shields.io/badge/React-18%2F19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)
![Status](https://img.shields.io/badge/Status-Development-yellow)

**CortinasExpress Configurator** es una plataforma de orquestación de servicios de campo de alta fidelidad (*Field Service Orchestrator*). Diseñada para cerrar la brecha entre la planificación centralizada y la ejecución operativa, la aplicación proporciona una interfaz dual que permite la gestión de órdenes de trabajo complejas y su ejecución secuencial en campo mediante dispositivos móviles.

El sistema destaca por su **validación contextual**, guiando al operario paso a paso a través de procedimientos técnicos (mediciones, selección de tejidos y normativas) mientras mantiene una conexión simulada con sistemas de ingeniería para asegurar la viabilidad técnica.

## 🚀 Características Principales

-   **Interfaz Dual de Alta Fidelidad:** Diseño responsivo optimizado para operarios en movilidad.
-   **Validación Contextual IA:** Feedback inmediato sobre la viabilidad de fabricación.
-   **Gestión de Órdenes Complejas:** Flujo guiado para configuración de medidas y materiales.
-   **Protección de Margen:** Lógica de negocio dinámica para ocultar precios en pedidos de alto volumen.
-   **Reporte Automático:** Generación de informes técnicos en HTML para ingeniería y ventas.

## 🛠️ Stack Tecnológico

La arquitectura utiliza un ecosistema de última generación para garantizar precisión y fluidez:

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Core** | React 18/19 + TypeScript | Lógica de negocio robusta, tipada y escalable. |
| **Estilos** | Tailwind CSS | Diseño *mobile-first* rápido y responsivo. |
| **Backend/Data** | Supabase | Persistencia de métricas, clientes y estados de órdenes. |
| **UI/UX** | Lucide React | Iconografía técnica para feedback visual inmediato. |

## ⚖️ Reglas de Negocio (Lógica del Orchestrator)

El sistema aplica restricciones críticas automáticamente para minimizar errores humanos:

* **📏 Restricciones de Ingeniería:**
    * Límite de fabricación: **270 cm de altura**.
    * *Acción:* Valores superiores activan un flujo de validación manual forzosa.
* **📦 Umbral de Ejecución Directa:**
    * Requisito mínimo: **10 unidades**.
    * *Acción:* Cantidades menores no permiten el paso a "Compra Directa".
* **🛡️ Protección de Margen y Volumen:**
    * Disparadores: **>100 unidades** o **>2.500€**.
    * *Acción:* Ocultación dinámica de precios y derivación a revisión comercial.

## 📂 Estructura del Proyecto

```plaintext
├── components/           # Orquestadores de la interfaz dual
│   ├── Step1.tsx         # Datos profesionales (CIF/NIF/Razón Social)
│   ├── Step2.tsx         # Selector de materiales y confección técnica
│   ├── Step3.tsx         # Módulo de mediciones y cálculo de área
│   ├── Step4.tsx         # Resumen, avisos legales y envío
├── services/             # Conectividad externa
│   └── supabase.ts       # Cliente de orquestación de datos
├── constants.ts          # Parámetros técnicos y umbrales
└── types.ts              # Definiciones TypeScript (Arquitectura de datos)
