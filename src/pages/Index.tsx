import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const API_URL = 'https://functions.poehali.dev/18fc91f7-34ba-4d60-809b-e05bc70f0b7a';

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [notes, setNotes] = useState('');

  const services = [
    {
      icon: 'Laptop',
      title: 'Ремонт ноутбуков',
      description: 'Диагностика, замена комплектующих, чистка, апгрейд',
      price: 'от 1500 ₽'
    },
    {
      icon: 'Monitor',
      title: 'Ремонт ПК',
      description: 'Сборка, настройка, замена компонентов, модернизация',
      price: 'от 1000 ₽'
    },
    {
      icon: 'Smartphone',
      title: 'Ремонт телефонов',
      description: 'Замена экранов, батарей, разъемов, программные проблемы',
      price: 'от 2000 ₽'
    },
    {
      icon: 'HardDrive',
      title: 'Восстановление данных',
      description: 'Восстановление информации с поврежденных носителей',
      price: 'от 3000 ₽'
    },
    {
      icon: 'Router',
      title: 'Настройка сетей',
      description: 'Wi-Fi, локальные сети, удаленный доступ',
      price: 'от 1200 ₽'
    },
    {
      icon: 'Shield',
      title: 'Удаление вирусов',
      description: 'Полная очистка системы, установка антивируса',
      price: 'от 800 ₽'
    }
  ];

  const priceList = [
    { service: 'Диагностика компьютера', price: '500 ₽' },
    { service: 'Чистка от пыли', price: '1000 ₽' },
    { service: 'Замена термопасты', price: '800 ₽' },
    { service: 'Установка Windows', price: '1500 ₽' },
    { service: 'Замена экрана ноутбука', price: 'от 3000 ₽' },
    { service: 'Замена батареи ноутбука', price: 'от 2500 ₽' },
    { service: 'Ремонт материнской платы', price: 'от 2000 ₽' },
    { service: 'Восстановление данных', price: 'от 3000 ₽' }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Выберите дату и время');
      return;
    }

    if (!clientName || !clientPhone) {
      toast.error('Заполните имя и телефон');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: selectedTime,
          service_type: serviceType,
          notes: notes
        })
      });

      if (response.ok) {
        toast.success('Заявка отправлена!', {
          description: `Вы записаны на ${selectedDate.toLocaleDateString('ru-RU')} в ${selectedTime}`
        });
        setIsBookingOpen(false);
        setSelectedDate(undefined);
        setSelectedTime(null);
        setClientName('');
        setClientPhone('');
        setClientEmail('');
        setServiceType('');
        setNotes('');
      } else {
        toast.error('Ошибка отправки заявки');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://cdn.poehali.dev/files/vk_av_new_crds.png" alt="SmartBook" className="h-12" />
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#services" className="hover:text-primary transition-colors">Услуги</a>
            <a href="#price" className="hover:text-primary transition-colors">Прайс</a>
            <a href="#contact" className="hover:text-primary transition-colors">Контакты</a>
          </nav>
          <Button onClick={() => setIsBookingOpen(true)} className="bg-secondary text-white hover:bg-secondary/90">
            <Icon name="Calendar" size={18} className="mr-2" />
            Записаться
          </Button>
        </div>
      </header>

      <section className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-white">
        <div className="container mx-auto text-center animate-fade-in">
          <Badge className="mb-6 bg-primary text-secondary border-0 font-bold">
            Экспресс-диагностика бесплатно
          </Badge>
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-secondary">
            Ремонт техники
            <br />
            <span className="text-primary">
              любой сложности
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Профессиональный ремонт компьютеров, ноутбуков и смартфонов. Гарантия до 12 месяцев. Работаем с 2015 года.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => setIsBookingOpen(true)}
              className="bg-primary text-secondary hover:bg-primary/90 text-lg px-8 font-bold"
            >
              Онлайн-запись
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Icon name="Phone" size={20} className="mr-2" />
              +7 (999) 123-45-67
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-white border-2 border-gray-100 hover:border-primary transition-all">
              <Icon name="Clock" size={40} className="mx-auto mb-3 text-secondary" />
              <h3 className="font-bold text-lg mb-2">Быстро</h3>
              <p className="text-muted-foreground">Ремонт от 30 минут</p>
            </div>
            <div className="p-6 rounded-xl bg-white border-2 border-gray-100 hover:border-primary transition-all">
              <Icon name="BadgeCheck" size={40} className="mx-auto mb-3 text-secondary" />
              <h3 className="font-bold text-lg mb-2">Надежно</h3>
              <p className="text-muted-foreground">Гарантия до 12 месяцев</p>
            </div>
            <div className="p-6 rounded-xl bg-white border-2 border-gray-100 hover:border-primary transition-all">
              <Icon name="Award" size={40} className="mx-auto mb-3 text-secondary" />
              <h3 className="font-bold text-lg mb-2">Профессионально</h3>
              <p className="text-muted-foreground">Опыт работы 9+ лет</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Наши услуги</h2>
            <p className="text-lg text-muted-foreground">Комплексное решение любых технических проблем</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon name={service.icon as any} size={32} className="text-secondary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-secondary">{service.price}</span>
                    <Button variant="ghost" size="sm">
                      Подробнее
                      <Icon name="ChevronRight" size={16} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="price" className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Прайс-лист</h2>
            <p className="text-lg text-muted-foreground">Актуальные цены на популярные услуги</p>
          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y">
                {priceList.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-4 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">{item.service}</span>
                    <span className="text-lg font-bold text-secondary">{item.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 p-6 bg-secondary rounded-2xl text-white text-center">
            <Icon name="Info" size={32} className="mx-auto mb-3" />
            <p className="text-lg font-medium">
              Точная стоимость определяется после диагностики. Диагностика бесплатная!
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Готовы починить вашу технику?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Запишитесь на бесплатную диагностику прямо сейчас
          </p>
          <Button 
            size="lg" 
            onClick={() => setIsBookingOpen(true)}
            className="bg-primary text-secondary hover:bg-primary/90 text-lg px-12 py-6 font-bold"
          >
            <Icon name="Calendar" size={24} className="mr-2" />
            Записаться онлайн
          </Button>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Icon name="MapPin" size={32} className="mx-auto mb-3 text-secondary" />
              <h3 className="font-bold mb-2">Адрес</h3>
              <p className="text-muted-foreground">г. Москва, ул. Ленина, 123</p>
            </div>
            <div>
              <Icon name="Phone" size={32} className="mx-auto mb-3 text-secondary" />
              <h3 className="font-bold mb-2">Телефон</h3>
              <p className="text-muted-foreground">+7 (999) 123-45-67</p>
            </div>
            <div>
              <Icon name="Clock" size={32} className="mx-auto mb-3 text-secondary" />
              <h3 className="font-bold mb-2">Режим работы</h3>
              <p className="text-muted-foreground">Пн-Пт: 9:00 - 20:00<br />Сб-Вс: 10:00 - 18:00</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-secondary text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="https://cdn.poehali.dev/files/vk_av_new_crds.png" alt="SmartBook" className="h-8 brightness-0 invert" />
          </div>
          <p className="text-gray-300">© 2024 SmartBook. Магазин компьютерной техники</p>
        </div>
      </footer>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Онлайн-запись на ремонт</DialogTitle>
            <DialogDescription>
              Выберите удобную дату и время для диагностики вашей техники
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Выберите дату:</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border mx-auto"
              />
            </div>
            
            {selectedDate && (
              <div className="animate-fade-in">
                <h3 className="font-semibold mb-3">Выберите время:</h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? 'bg-primary' : ''}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedDate && selectedTime && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Вы выбрали:</p>
                  <p className="font-semibold text-lg">
                    {selectedDate.toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })} в {selectedTime}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="clientName">Ваше имя *</Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientPhone">Телефон *</Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+7 (999) 123-45-67"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="ivan@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceType">Тип услуги</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите услугу" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ремонт ноутбуков">Ремонт ноутбуков</SelectItem>
                        <SelectItem value="Ремонт ПК">Ремонт ПК</SelectItem>
                        <SelectItem value="Ремонт телефонов">Ремонт телефонов</SelectItem>
                        <SelectItem value="Восстановление данных">Восстановление данных</SelectItem>
                        <SelectItem value="Настройка сетей">Настройка сетей</SelectItem>
                        <SelectItem value="Удаление вирусов">Удаление вирусов</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Описание проблемы</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Опишите вашу проблему..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleBooking} 
              className="w-full bg-primary text-secondary hover:bg-primary/90 font-bold"
              size="lg"
              disabled={!selectedDate || !selectedTime}
            >
              Подтвердить запись
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;