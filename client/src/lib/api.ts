const API_URL = '/api';

export const api = {
  async login(usuario: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }),
    });
    if (!response.ok) throw new Error('Error de autenticación');
    return response.json();
  },

  async getPaquetes(token: string) {
    const response = await fetch(`${API_URL}/paquetes/asignados`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al obtener paquetes');
    return response.json();
  },

  async getPaqueteDetalle(id: number, token: string) {
    const response = await fetch(`${API_URL}/paquetes/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al obtener detalle');
    return response.json();
  },

  async registrarEntrega(token: string, data: any) {
    const response = await fetch(`${API_URL}/entregas/registrar`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al registrar entrega');
    return response.json();
  }
};
