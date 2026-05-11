import { api, type ApiProfessional, type ApiService, type PublicSlots, type PublicTenant } from '../lib/api';

export const publicBookingRepository = {
  loadTenant: (slug: string): Promise<PublicTenant> => api.getPublicTenant(slug),
  loadServices: (slug: string): Promise<ApiService[]> => api.getPublicServices(slug),
  loadProfessionals: (slug: string, serviceId?: string): Promise<ApiProfessional[]> => api.getPublicProfessionals(slug, serviceId),
  loadSlots: (slug: string, professionalId: string, serviceId: string, date: string): Promise<PublicSlots> =>
    api.getPublicSlots(slug, professionalId, serviceId, date),
  createAppointment: (slug: string, payload: any): Promise<any> => api.createPublicAppointment(slug, payload),
};
