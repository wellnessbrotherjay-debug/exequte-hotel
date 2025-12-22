const jsonHeaders = { 'Content-Type': 'application/json' };

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || 'Request failed');
  }
  return data;
};

export const requestBrandPack = async (brandId: string) => {
  const res = await fetch(`/api/brands/${brandId}/brand-pack`, {
    method: 'POST',
    headers: jsonHeaders
  });
  return handleResponse(res);
};

export const createCampaign = async (payload: any) => {
  const res = await fetch('/api/campaigns/create', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const sendCalendar = async (entries: any[]) => {
  const res = await fetch('/api/calendar/bulk-insert', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ entries })
  });
  return handleResponse(res);
};
