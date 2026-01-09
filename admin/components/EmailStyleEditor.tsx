import React, { useState, useEffect } from 'react';
import { Palette, Save, RefreshCw, Eye, Copy, Download, Mail, Users, Building, FileText, Plus, Trash2, Edit3 } from 'lucide-react';

interface EmailStyle {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  headerGradient: string;
  buttonColor: string;
  buttonTextColor: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  type: 'customer' | 'admin' | 'copy-manager' | 'internal';
  subject: string;
  htmlContent: string;
  variables: string[];
  description: string;
}

const defaultStyles: EmailStyle = {
  primaryColor: '#803746',
  secondaryColor: '#a05252',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  borderColor: '#e5e7eb',
  headerGradient: 'linear-gradient(135deg, #803746, #a05252)',
  buttonColor: '#803746',
  buttonTextColor: '#ffffff'
};

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'presupuesto-cliente',
    name: 'Presupuesto - Cliente',
    type: 'customer',
    subject: 'Presupuesto para tu pedido {{id_pedido}}',
    description: 'Email de presupuesto para clientes',
    variables: ['nombre_cliente', 'id_pedido', 'total_unidades', 'direccion', 'fecha_presupuesto'],
    htmlContent: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presupuesto - {{id_pedido}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: {{textColor}}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: {{backgroundColor}}; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid {{primaryColor}};">
            <h1 style="color: {{primaryColor}}; margin: 0;">📋 PRESUPUESTO</h1>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h2 style="color: {{primaryColor}}; margin-bottom: 15px;">¡Hola {{nombre_cliente}}!</h2>
            
            <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid {{primaryColor}};">
                <p>Adjunto encontrarás el presupuesto solicitado para el pedido <strong>{{id_pedido}}</strong>.</p>
            </div>
            
            <p>Detalles del presupuesto:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 10px; padding: 8px; background-color: white; border-radius: 3px; border-left: 3px solid {{primaryColor}};">
                        <strong>📦 Total de Unidades:</strong> {{total_unidades}}
                    </li>
                    <li style="margin-bottom: 10px; padding: 8px; background-color: white; border-radius: 3px; border-left: 3px solid {{primaryColor}};">
                        <strong>📍 Dirección de entrega:</strong> {{direccion}}
                    </li>
                    <li style="margin-bottom: 10px; padding: 8px; background-color: white; border-radius: 3px; border-left: 3px solid {{primaryColor}};">
                        <strong>📅 Fecha de presupuesto:</strong> {{fecha_presupuesto}}
                    </li>
                </ul>
            </div>
            
            <p>Quedamos a la espera de tu aprobación para proceder con el pedido.</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="#" style="background-color: {{buttonColor}}; color: {{buttonTextColor}}; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 500;">Aprobar Presupuesto</a>
            </div>
            
            <p>Si tienes alguna pregunta o necesitas ajustar algo, no dudes en contactarnos.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid {{borderColor}}; color: #666;">
            <p>Saludos cordiales,<br>
            <strong>Equipo Industrial CRM</strong></p>
            <p style="font-size: 12px; margin-top: 10px;">
                Este es un correo automático, por favor no responda a esta dirección.
            </p>
        </div>
    </div>
</body>
</html>`
  },
  {
    id: 'inicio-produccion-cliente',
    name: 'Inicio Producción - Cliente',
    type: 'customer',
    subject: 'Tu pedido {{id_pedido}} está en producción',
    description: 'Confirmación de inicio de producción para clientes',
    variables: ['nombre_cliente', 'id_pedido', 'fecha_inicio'],
    htmlContent: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de Producción - {{id_pedido}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: {{textColor}}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: {{backgroundColor}}; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #28a745;">
            <h1 style="color: #28a745; margin: 0;">🚀 INICIO DE PRODUCCIÓN</h1>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h2 style="color: #28a745; margin-bottom: 15px;">¡Gracias por tu pedido, {{nombre_cliente}}!</h2>
            
            <div style="background-color: #f0f8f0; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
                <p>Confirmamos que hemos recibido toda la documentación para el pedido <strong>{{id_pedido}}</strong>.</p>
            </div>
            
            <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745; text-align: center;">
                <div style="font-size: 2em; margin-bottom: 10px;">🏭</div>
                <h3 style="color: #155724; margin: 0 0 10px 0; font-size: 1.2em;">¡Tu pedido está en producción!</h3>
                <p style="margin: 0;">El pedido ha pasado a estado: <strong>EN PRODUCCIÓN</strong></p>
                <p style="margin: 10px 0 0 0; color: #666;"><small>Fecha de inicio: {{fecha_inicio}}</small></p>
            </div>
            
            <p>Nuestro equipo está trabajando en tu pedido con la máxima dedicación.</p>
            
            <p>Te notificaremos cuando esté listo para el envío.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid {{borderColor}}; color: #666;">
            <p>Saludos cordiales,<br>
            <strong>Equipo Industrial CRM</strong></p>
            <p style="font-size: 12px; margin-top: 10px;">
                Este es un correo automático, por favor no responda a esta dirección.
            </p>
        </div>
    </div>
</body>
</html>`
  },
  {
    id: 'notificacion-gestor',
    name: 'Notificación - Gestor',
    type: 'admin',
    subject: 'Nuevo pedido {{id_pedido}} - {{nombre_cliente}}',
    description: 'Notificación para gestores sobre nuevos pedidos',
    variables: ['nombre_cliente', 'id_pedido', 'total_unidades', 'direccion', 'telefono', 'email'],
    htmlContent: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo Pedido - {{id_pedido}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: {{textColor}}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: {{backgroundColor}}; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid {{secondaryColor}};">
            <h1 style="color: {{secondaryColor}}; margin: 0;">📋 NUEVO PEDIDO</h1>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h2 style="color: {{secondaryColor}}; margin-bottom: 15px;">Hola Equipo,</h2>
            
            <p>Se ha recibido un nuevo pedido que requiere atención:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: {{primaryColor}}; margin: 0 0 15px 0;">Detalles del Pedido</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>👤 Cliente:</strong> {{nombre_cliente}}
                    </li>
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>📋 ID Pedido:</strong> {{id_pedido}}
                    </li>
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>📦 Unidades:</strong> {{total_unidades}}
                    </li>
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>📍 Dirección:</strong> {{direccion}}
                    </li>
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>📞 Teléfono:</strong> {{telefono}}
                    </li>
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>✉️ Email:</strong> {{email}}
                    </li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="#" style="background-color: {{buttonColor}}; color: {{buttonTextColor}}; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 500;">Ver Pedido Completo</a>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;"><strong>⚠️ Prioridad:</strong> Por favor, revisar y asignar a comercial correspondiente.</p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid {{borderColor}}; color: #666;">
            <p>Sistema de Gestión - Industrial CRM</p>
        </div>
    </div>
</body>
</html>`
  },
  {
    id: 'pedido-urgente-gestor',
    name: 'Pedido Urgente - Gestor',
    type: 'admin',
    subject: '🚨 URGENTE: Pedido {{id_pedido}} - {{nombre_cliente}}',
    description: 'Notificación urgente para gestores',
    variables: ['nombre_cliente', 'id_pedido', 'total_unidades', 'direccion', 'telefono', 'email', 'motivo_urgencia'],
    htmlContent: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Urgente - {{id_pedido}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: {{textColor}}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: {{backgroundColor}}; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #dc3545;">
            <h1 style="color: #dc3545; margin: 0;">🚨 PEDIDO URGENTE</h1>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h2 style="color: #dc3545; margin-bottom: 15px;">¡ATENCIÓN INMEDIATA REQUERIDA!</h2>
            
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #721c24; margin: 0 0 10px 0;">🚨 Motivo de Urgencia</h3>
                <p style="margin: 0; color: #721c24;">{{motivo_urgencia}}</p>
            </div>
            
            <p><strong>Detalles del Pedido Urgente:</strong></p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: {{primaryColor}}; margin: 0 0 15px 0;">Información del Cliente</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>👤 Cliente:</strong> {{nombre_cliente}}
                    </li>
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>📋 ID Pedido:</strong> {{id_pedido}}
                    </li>
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>📦 Unidades:</strong> {{total_unidades}}
                    </li>
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>📍 Dirección:</strong> {{direccion}}
                    </li>
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>📞 Teléfono:</strong> {{telefono}}
                    </li>
                    <li style="margin-bottom: 8px; padding: 5px; background-color: white; border-radius: 3px;">
                        <strong>✉️ Email:</strong> {{email}}
                    </li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="#" style="background-color: #dc3545; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 500;">ATENDER URGENTE</a>
            </div>
            
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #0c5460;"><strong>⏰ Tiempo de respuesta:</strong> Por favor contactar al cliente en menos de 2 horas.</p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid {{borderColor}}; color: #666;">
            <p>Sistema de Gestión - Industrial CRM</p>
        </div>
    </div>
</body>
</html>`
  }
];

export const EmailStyleEditor: React.FC = () => {
  const [styles, setStyles] = useState<EmailStyle>(defaultStyles);
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(defaultTemplates[0]);
  const [activeTab, setActiveTab] = useState<'styles' | 'templates'>('styles');
  const [previewMode, setPreviewMode] = useState<'customer' | 'admin'>('customer');
  const [savedMessage, setSavedMessage] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({});

  // Cargar plantillas y estilos guardados al montar el componente
  useEffect(() => {
    const savedStyles = localStorage.getItem('emailStyles');
    const savedTemplates = localStorage.getItem('emailTemplates');
    
    if (savedStyles) {
      setStyles(JSON.parse(savedStyles));
    }
    
    if (savedTemplates) {
      const loadedTemplates = JSON.parse(savedTemplates);
      setTemplates(loadedTemplates);
      // Seleccionar la primera plantilla si existe
      if (loadedTemplates.length > 0) {
        setSelectedTemplate(loadedTemplates[0]);
      }
    } else {
      // Si no hay plantillas guardadas, guardar las plantillas por defecto
      localStorage.setItem('emailTemplates', JSON.stringify(defaultTemplates));
      setTemplates(defaultTemplates);
      setSelectedTemplate(defaultTemplates[0]);
    }
  }, []);

  const handleStyleChange = (key: keyof EmailStyle, value: string) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  const saveTemplates = () => {
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
    localStorage.setItem('emailStyles', JSON.stringify(styles));
    setSavedMessage('Plantillas y estilos guardados correctamente');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const addNewTemplate = () => {
    if (newTemplate.name && newTemplate.type) {
      const template: EmailTemplate = {
        id: `custom-${Date.now()}`,
        name: newTemplate.name,
        type: newTemplate.type as 'customer' | 'admin' | 'copy-manager' | 'internal',
        subject: newTemplate.subject || 'Nueva plantilla',
        description: newTemplate.description || '',
        variables: newTemplate.variables || [],
        htmlContent: newTemplate.htmlContent || '<p>Nueva plantilla</p>'
      };
      setTemplates(prev => [...prev, template]);
      setNewTemplate({});
      setEditingTemplate(false);
    }
  };

  const deleteTemplate = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta plantilla?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      if (selectedTemplate.id === id) {
        setSelectedTemplate(templates[0]);
      }
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'customer': return Users;
      case 'admin': return Building;
      case 'copy-manager': return Mail;
      case 'internal': return FileText;
      default: return Mail;
    }
  };

  const resetStyles = () => {
    setStyles(defaultStyles);
  };

  const saveStyles = () => {
    // Guardar en localStorage o enviar a backend
    localStorage.setItem('emailStyles', JSON.stringify(styles));
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
    setSavedMessage('Estilos y plantillas guardados correctamente');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const generateCSS = () => {
    return `
/* Estilos personalizados para correos */
.email-container {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  color: ${styles.textColor};
  line-height: 1.6;
}

.email-header {
  background: ${styles.headerGradient};
  padding: 30px;
  text-align: center;
  border-radius: 10px 10px 0 0;
}

.email-header h1 {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.email-content {
  background: ${styles.backgroundColor};
  padding: 30px;
  border: 1px solid ${styles.borderColor};
  border-top: none;
}

.email-reference {
  background: #f9fafb;
  border: 2px solid ${styles.primaryColor};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  text-align: center;
}

.email-button {
  background: ${styles.buttonColor};
  color: ${styles.buttonTextColor};
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
  font-weight: 500;
}

.email-footer {
  background: #374151;
  color: white;
  padding: 25px;
  text-align: center;
  border-radius: 0 0 10px 10px;
}
    `.trim();
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    alert('CSS copiado al portapapeles');
  };

  const downloadCSS = () => {
    const blob = new Blob([generateCSS()], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-styles.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewEmail = () => {
    // Reemplazar variables en la plantilla con datos de ejemplo
    const sampleData = {
      nombre_cliente: 'Juan Pérez García',
      id_pedido: 'INT-2025-001',
      total_unidades: 25,
      direccion: 'Calle Principal 123, 28001 Madrid',
      telefono: '+34 600 123 456',
      email: 'juan.perez@empresa.com',
      fecha_presupuesto: '15/01/2025',
      fecha_inicio: '16/01/2025',
      motivo_urgencia: 'Cliente necesita entrega antes del 20/01/2025'
    };

    let previewHtml = selectedTemplate.htmlContent;
    
    // Reemplazar estilos
    previewHtml = previewHtml.replace(/\{\{primaryColor\}\}/g, styles.primaryColor);
    previewHtml = previewHtml.replace(/\{\{secondaryColor\}\}/g, styles.secondaryColor);
    previewHtml = previewHtml.replace(/\{\{backgroundColor\}\}/g, styles.backgroundColor);
    previewHtml = previewHtml.replace(/\{\{textColor\}\}/g, styles.textColor);
    previewHtml = previewHtml.replace(/\{\{borderColor\}\}/g, styles.borderColor);
    previewHtml = previewHtml.replace(/\{\{buttonColor\}\}/g, styles.buttonColor);
    previewHtml = previewHtml.replace(/\{\{buttonTextColor\}\}/g, styles.buttonTextColor);
    
    // Reemplazar variables de datos
    Object.keys(sampleData).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      previewHtml = previewHtml.replace(regex, String(sampleData[key as keyof typeof sampleData]));
    });

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Vista Previa - ${selectedTemplate.name}</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f5f5f5;">
        ${previewHtml}
      </body>
      </html>
    `;

    const newWindow = window.open('', '_blank', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(fullHtml);
      newWindow.document.close();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('styles')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'styles'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          Estilos
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'templates'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Mail className="w-4 h-4 inline mr-2" />
          Plantillas
        </button>
      </div>

      {/* Mensaje de guardado */}
      {savedMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {savedMessage}
        </div>
      )}

      {/* Contenido de Estilos */}
      {activeTab === 'styles' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Editor de Estilos de Correos
              </h2>
              <p className="text-sm text-gray-500">Personaliza los colores y estilos de los correos electrónicos</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={resetStyles}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Restablecer
              </button>
          <button
            onClick={saveStyles}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center"
          >
            <Save className="w-4 h-4 mr-1" />
            Guardar
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-200 rounded-lg text-sm">
          {savedMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Editor */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Colores Principales</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Principal (Header, Referencias)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={styles.primaryColor}
                  onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={styles.primaryColor}
                  onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Secundario (Gradiente)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={styles.secondaryColor}
                  onChange={(e) => handleStyleChange('secondaryColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={styles.secondaryColor}
                  onChange={(e) => handleStyleChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Botón
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={styles.buttonColor}
                  onChange={(e) => handleStyleChange('buttonColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={styles.buttonColor}
                  onChange={(e) => handleStyleChange('buttonColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Texto del Botón
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={styles.buttonTextColor}
                  onChange={(e) => handleStyleChange('buttonTextColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={styles.buttonTextColor}
                  onChange={(e) => handleStyleChange('buttonTextColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-gray-800">Vista Previa</h3>
            <div className="flex space-x-2">
              <button
                onClick={previewEmail}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                Previsualizar
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="mb-4">
              <div 
                className="h-20 rounded-t-lg flex items-center justify-center text-white font-bold"
                style={{ background: styles.headerGradient }}
              >
                Header de Correo
              </div>
              <div 
                className="h-32 border-l border-r border-b rounded-b-lg p-4"
                style={{ 
                  backgroundColor: styles.backgroundColor,
                  borderColor: styles.borderColor,
                  color: styles.textColor
                }}
              >
                <div className="text-center mb-4">
                  <div 
                    className="inline-block px-4 py-2 rounded"
                    style={{ 
                      backgroundColor: styles.primaryColor + '20',
                      border: `2px solid ${styles.primaryColor}`,
                      color: styles.primaryColor
                    }}
                  >
                    Referencia: EG12345678
                  </div>
                </div>
                <div className="text-center">
                  <button 
                    className="px-4 py-2 rounded text-sm font-medium"
                    style={{ 
                      backgroundColor: styles.buttonColor,
                      color: styles.buttonTextColor
                    }}
                  >
                    Botón de Acción
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CSS Export */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Exportar CSS</h4>
            <div className="space-y-2">
              <button
                onClick={copyCSS}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm flex items-center justify-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar CSS
              </button>
              <button
                onClick={downloadCSS}
                className="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar CSS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Contenido de Plantillas */}
      {activeTab === 'templates' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Gestión de Plantillas de Correo
              </h2>
              <p className="text-sm text-gray-500">Administra las diferentes plantillas de correo para clientes y gestores</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={saveTemplates}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center"
              >
                <Save className="w-4 h-4 mr-1" />
                Guardar Todo
              </button>
              <button
                onClick={() => setEditingTemplate(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nueva Plantilla
              </button>
            </div>
          </div>

          {/* Lista de Plantillas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Selector de Plantillas */}
            <div className="lg:col-span-1">
              <h3 className="text-md font-semibold text-gray-800 mb-4">Plantillas Disponibles</h3>
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        {React.createElement(getTemplateIcon(template.type), { className: "w-4 h-4 mt-1 text-gray-600" })}
                        <div>
                          <h4 className="text-sm font-medium text-gray-800">{template.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              template.type === 'customer' ? 'bg-blue-100 text-blue-800' :
                              template.type === 'admin' ? 'bg-green-100 text-green-800' :
                              template.type === 'copy-manager' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {template.type === 'customer' ? 'Cliente' :
                               template.type === 'admin' ? 'Gestor' :
                               template.type === 'copy-manager' ? 'Copia Gestor' : 'Interno'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {template.variables.length} variables
                            </span>
                          </div>
                        </div>
                      </div>
                      {!['presupuesto-cliente', 'inicio-produccion-cliente', 'notificacion-gestor', 'pedido-urgente-gestor'].includes(template.id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTemplate(template.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor de Plantilla */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-800">Editor: {selectedTemplate.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => previewEmail()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Previsualizar
                  </button>
                </div>
              </div>

              {/* Información de la Plantilla */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={selectedTemplate.name}
                      onChange={(e) => {
                        const updated = { ...selectedTemplate, name: e.target.value };
                        setSelectedTemplate(updated);
                        setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                    <input
                      type="text"
                      value={selectedTemplate.subject}
                      onChange={(e) => {
                        const updated = { ...selectedTemplate, subject: e.target.value };
                        setSelectedTemplate(updated);
                        setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={selectedTemplate.description}
                    onChange={(e) => {
                      const updated = { ...selectedTemplate, description: e.target.value };
                      setSelectedTemplate(updated);
                      setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variables Disponibles</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <span
                        key={variable}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Editor HTML */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenido HTML</label>
                <textarea
                  value={selectedTemplate.htmlContent}
                  onChange={(e) => {
                    const updated = { ...selectedTemplate, htmlContent: e.target.value };
                    setSelectedTemplate(updated);
                    setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm h-96 font-mono text-xs resize-none"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Modal para Nueva Plantilla */}
          {editingTemplate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Nueva Plantilla</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={newTemplate.name || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Ej: Confirmación Entrega - Cliente"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                    <input
                      type="text"
                      value={newTemplate.subject || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Ej: Confirmación de entrega para {{nombre_cliente}}"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={newTemplate.type || 'customer'}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="customer">Cliente</option>
                      <option value="admin">Gestor</option>
                      <option value="copy-manager">Copia Gestor</option>
                      <option value="internal">Interno</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={newTemplate.description || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm h-20 resize-none"
                      placeholder="Descripción breve de la plantilla..."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setEditingTemplate(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addNewTemplate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Crear Plantilla
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};