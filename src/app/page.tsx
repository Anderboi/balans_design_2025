import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Дашборд</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Проекты</CardTitle>
            <CardDescription>Всего проектов: 5</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/projects">
              <Button>Перейти к проектам</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Задачи</CardTitle>
            <CardDescription>Активных задач: 12</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tasks">
              <Button>Перейти к задачам</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Материалы</CardTitle>
            <CardDescription>Всего материалов: 120</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/materials">
              <Button>Перейти к материалам</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние проекты</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-100 rounded-md">Квартира на Ленинском проспекте</li>
              <li className="p-2 hover:bg-gray-100 rounded-md">Загородный дом в Подмосковье</li>
              <li className="p-2 hover:bg-gray-100 rounded-md">Офис IT-компании</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ближайшие задачи</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-100 rounded-md">Подготовить планировочное решение</li>
              <li className="p-2 hover:bg-gray-100 rounded-md">Согласовать отделочные материалы</li>
              <li className="p-2 hover:bg-gray-100 rounded-md">Встреча с клиентом</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
