import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  // Демо-данные для проекта
  const project = {
    id: params.id,
    name: params.id === "1" ? "Квартира на Ленинском проспекте" : 
          params.id === "2" ? "Загородный дом в Подмосковье" : 
          "Офис IT-компании",
    address: params.id === "1" ? "г. Москва, Ленинский проспект, д. 100" : 
             params.id === "2" ? "Московская обл., Одинцовский р-н" : 
             "г. Москва, ул. Тверская, д. 15",
    area: params.id === "1" ? 120 : params.id === "2" ? 250 : 180,
    stage: params.id === "1" ? "Концепция" : params.id === "2" ? "Рабочая" : "Предпроектная",
    client: params.id === "1" ? "Иванов И.И." : params.id === "2" ? "Петров П.П." : "ООО 'ИТ Решения'",
    residents: "Семья из 4 человек",
    demolition_info: "Демонтаж перегородок в гостиной",
    construction_info: "Возведение новых перегородок в спальне",
    rooms: [
      { id: "1", name: "Гостиная", area: 30, preferred_finishes: "Паркет, обои", furniture_equipment: ["Диван", "Телевизор", "Стеллаж"] },
      { id: "2", name: "Спальня", area: 20, preferred_finishes: "Паркет, краска", furniture_equipment: ["Кровать", "Шкаф", "Тумбочки"] },
      { id: "3", name: "Кухня", area: 15, preferred_finishes: "Плитка, краска", furniture_equipment: ["Кухонный гарнитур", "Холодильник", "Плита"] }
    ]
  };

  // Демо-данные для задач
  const tasks = [
    { id: "1", title: "Подготовить планировочное решение", status: "В процессе", due_date: "2023-06-15" },
    { id: "2", title: "Согласовать отделочные материалы", status: "К выполнению", due_date: "2023-06-20" },
    { id: "3", title: "Встреча с клиентом", status: "К выполнению", due_date: "2023-06-25" }
  ];

  // Демо-данные для спецификаций
  const specifications = [
    { id: "1", name: "Паркетная доска", type: "Отделка", manufacturer: "Tarkett", quantity: 50, unit: "м²" },
    { id: "2", name: "Обои", type: "Отделка", manufacturer: "Rasch", quantity: 10, unit: "рулон" },
    { id: "3", name: "Диван", type: "Мебель", manufacturer: "IKEA", quantity: 1, unit: "шт." }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <Button>Редактировать проект</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Адрес:</span> {project.address}</p>
              <p><span className="font-medium">Площадь:</span> {project.area} м²</p>
              <p><span className="font-medium">Стадия:</span> {project.stage}</p>
            </div>
            <div>
              <p><span className="font-medium">Клиент:</span> {project.client}</p>
              <p><span className="font-medium">Проживающие:</span> {project.residents}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rooms">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rooms">Помещения</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger>
          <TabsTrigger value="specifications">Спецификации</TabsTrigger>
          <TabsTrigger value="info">Дополнительно</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rooms" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Помещения</h2>
            <Button>Добавить помещение</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.rooms.map((room) => (
              <Card key={room.id}>
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><span className="font-medium">Площадь:</span> {room.area} м²</p>
                  <p><span className="font-medium">Отделка:</span> {room.preferred_finishes}</p>
                  <p><span className="font-medium">Наполнение:</span></p>
                  <ul className="list-disc pl-5">
                    {room.furniture_equipment.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Задачи</h2>
            <Button>Добавить задачу</Button>
          </div>
          
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-500">Срок: {task.due_date}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {task.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Спецификации</h2>
            <Button>Добавить материал</Button>
          </div>
          
          <div className="space-y-4">
            {specifications.map((spec) => (
              <Card key={spec.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{spec.name}</h3>
                      <p className="text-sm text-gray-500">Производитель: {spec.manufacturer}</p>
                      <p className="text-sm text-gray-500">Тип: {spec.type}</p>
                    </div>
                    <div>
                      <p className="font-medium">{spec.quantity} {spec.unit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="info" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Дополнительная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Информация по демонтажу</h3>
                  <p>{project.demolition_info}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Информация по монтажу</h3>
                  <p>{project.construction_info}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}