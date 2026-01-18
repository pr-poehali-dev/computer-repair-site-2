import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Booking {
  id: number;
  client_name: string;
  client_phone: string;
  client_email?: string;
  booking_date: string;
  booking_time: string;
  service_type?: string;
  status: string;
  notes?: string;
  created_at: string;
}

const API_URL = 'https://functions.poehali.dev/18fc91f7-34ba-4d60-809b-e05bc70f0b7a';

const Admin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadBookings = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? API_URL : `${API_URL}?status=${statusFilter}`;
      const response = await fetch(url);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      toast.error('Ошибка загрузки записей');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const updateBookingStatus = async (id: number, status: string, notes?: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes })
      });

      if (response.ok) {
        toast.success('Статус обновлен');
        loadBookings();
        setIsEditOpen(false);
      } else {
        toast.error('Ошибка обновления');
      }
    } catch (error) {
      toast.error('Ошибка обновления');
      console.error(error);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Удалить запись?')) return;

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Запись удалена');
        loadBookings();
      } else {
        toast.error('Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка удаления');
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: 'Ожидает', className: 'bg-yellow-500' },
      confirmed: { label: 'Подтверждена', className: 'bg-blue-500' },
      completed: { label: 'Завершена', className: 'bg-green-500' },
      cancelled: { label: 'Отменена', className: 'bg-red-500' }
    };

    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://cdn.poehali.dev/files/vk_av_new_crds.png" alt="SmartBook" className="h-10" />
            <h1 className="text-xl font-bold text-secondary">Админка</h1>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Icon name="Home" size={18} className="mr-2" />
            На главную
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Записи на ремонт</CardTitle>
              <div className="flex gap-4 items-center">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Фильтр по статусу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все записи</SelectItem>
                    <SelectItem value="pending">Ожидают</SelectItem>
                    <SelectItem value="confirmed">Подтверждены</SelectItem>
                    <SelectItem value="completed">Завершены</SelectItem>
                    <SelectItem value="cancelled">Отменены</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={loadBookings} variant="outline">
                  <Icon name="RefreshCw" size={18} className="mr-2" />
                  Обновить
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Icon name="Loader2" size={32} className="animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-50" />
                <p>Записей не найдено</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Время</TableHead>
                    <TableHead>Услуга</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">#{booking.id}</TableCell>
                      <TableCell>{booking.client_name}</TableCell>
                      <TableCell>{booking.client_phone}</TableCell>
                      <TableCell>{booking.client_email || '—'}</TableCell>
                      <TableCell>
                        {new Date(booking.booking_date).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>{booking.booking_time}</TableCell>
                      <TableCell>{booking.service_type || '—'}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsEditOpen(true);
                            }}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => deleteBooking(booking.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Ожидают</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-muted-foreground">Подтверждены</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Завершены</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary">
                  {bookings.length}
                </div>
                <div className="text-sm text-muted-foreground">Всего</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование записи #{selectedBooking?.id}</DialogTitle>
            <DialogDescription>
              Клиент: {selectedBooking?.client_name}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Статус</label>
                <Select
                  defaultValue={selectedBooking.status}
                  onValueChange={(value) => {
                    setSelectedBooking({ ...selectedBooking, status: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="confirmed">Подтверждена</SelectItem>
                    <SelectItem value="completed">Завершена</SelectItem>
                    <SelectItem value="cancelled">Отменена</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Примечания</label>
                <Textarea
                  defaultValue={selectedBooking.notes || ''}
                  onChange={(e) => {
                    setSelectedBooking({ ...selectedBooking, notes: e.target.value });
                  }}
                  rows={4}
                  placeholder="Дополнительная информация..."
                />
              </div>

              <Button
                onClick={() =>
                  updateBookingStatus(
                    selectedBooking.id,
                    selectedBooking.status,
                    selectedBooking.notes
                  )
                }
                className="w-full bg-primary text-secondary hover:bg-primary/90"
              >
                Сохранить изменения
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
