import { News } from "../shared/types/news.type";
import { Planets } from "../shared/types/planets.type";
import { RoleUsers } from "../shared/types/role-users.enum";
import { Ticket } from "../shared/types/ticket.type";
import { User } from "../shared/types/user.type";
import { IShow } from "./show.types";

export const news: News[] = [
  {
    header: 'Планеты',
    picture: [
      'assets/images/newsPlanet1.png',
      'assets/images/newsPlanet2.png',
    ],
    content: [
      'АСТ­РО­НО­МИ­ЧЕ­СКИЕ НАБЛЮ­ДЕ­НИЯ В МОС­КОВ­СКОМ ПЛА­НЕ­ТА­РИИ',
      '3 МАЯ – ВСЕМИРНЫЙ ДЕНЬ СОЛНЦА'
    ]
  },
  {
    header: 'Планеты',
    picture: [
      'assets/images/newsPlanet1.png',
      'assets/images/newsPlanet2.png',
    ],
    content: [
      'АСТ­РО­НО­МИ­ЧЕ­СКИЕ НАБЛЮ­ДЕ­НИЯ В МОС­КОВ­СКОМ ПЛА­НЕ­ТА­РИИ',
      'hello'
    ]
  },
  {
    header: 'Мероприятия',
    picture: [
      'assets/images/newsEvent1.png',
      'assets/images/newsEvent2.png',
      'assets/images/newsEvent3.png',
      'assets/images/newsEvent4.png'
    ],
    content: [
      '«HANS ZIMMER | SOUNDTRACKS»',
      'ОТКРЫТО БРОНИРОВАНИЕ ШКОЛЬНЫХ ЭКСКУРСИЙ НА МАРТ!',
      'ОТКРЫТО БРОНИРОВАНИЕ ШКОЛЬНЫХ ЭКСКУРСИЙ НА МАРТ!',
      '12 ФЕВРАЛЯ – ОРКЕСТР «НЕОКЛАССИКА»: ФОРТЕПИАНО + СТРУННЫЕ'
    ]
  },
  {
    header: 'Для детей'
  },
  {
    header: 'Ракетостроение'
  }
]


// export let users: User[] = [
//   {
//     login: 'mrn',
//     password: '1234qwer!',
//     email: 'mrn@gmail.com',
//     role: RoleUsers.USER,
//     discount: 0,
//     interested: [news[2], news[1]],
//     avatar: 'assets/images/avatar_1.png',
//     avatarBody: 'assets/images/avatar1.png'
//    },
//    {
//     login: 'Katletka',
//     password: '1234qwer!',
//     email: 'katletka@gmail.com',
//     role: RoleUsers.USER,
//     discount: 40,
//     interested: [news[0], news[1]],
//     avatar: 'assets/images/avatar_4.png',
//     avatarBody: 'assets/images/avatar4.png'
//    },
//    {
//     login: 'Svetka',
//     password: '1234qwer!',
//     email: 'svetka@gmail.com',
//     role: RoleUsers.USER,
//     discount: 0,
//     interested: [news[2], news[3]],
//     avatar: 'assets/images/avatar_5.png',
//     avatarBody: 'assets/images/avatar5.png'
//    }
// ]



export const ShowsMock: IShow[] = [
  {
    id: 1,
    title: 'Интерстеллар',
    descr: '',
    tags: 'фантастика, драма, приключения',
    posterSrc: 'assets/images/interstellarPict.png',
    price: 15,
    
  },
  {
    id: 2,
    title: 'Звездные войны',
    descr: '',
    tags: 'фантастика, драма, приключения',
    posterSrc: 'assets/images/starWarsPict.png',
    price: 15,
    
  },
  {
    id: 3,
    title: 'Обливион',
    descr: '',
    tags: 'фантастика, драма, приключения',
    posterSrc: 'assets/images/oblivionPict.png',
    price: 15,
    
  },
  {
    id: 4,
    title: 'Маленький принц',
    descr: '',
    tags: 'фантастика, драма, приключения',
    posterSrc: 'assets/images/littlePrincePict.png',
    price: 15,
    
  },
  {
    id: 5,
    title: 'Чужой',
    descr: '',
    tags: 'фантастика, драма, приключения',
    posterSrc: 'assets/images/stranger.png',
    price: 15,
    
  },
]

export let questions: Questions[] = [
  {
    ask: 'Разрешена ли фото- и видеосъемка?',
    content: 'Любительская съемка разрешена в Обсерватории, в фойе Планетария и в звездном зале до начала и после сеанса. Свои фото можно публиковать в Инстаграм с хэштегом #planetarium_by. Во время сеанса в Планетарии пользоваться телефонами, фотоаппаратами, видеокамерами и другими светящимися устройствами запрещено. По вопросам профессиональной съемки просим связываться с администрацией Планетария.'
  },
  {
    ask: 'Есть ли в Планетрии камеры хранения?',
    content: 'Камеры хранения на территории Планетарии нет. Администрация не несет ответственности за вещи, оставленные без присмотра. Согласно Правилам посещения минского Планетария и требованиям по технике безопасности проносить в зрительный зал чемоданы, коляски, самокаты и другие крупные вещи/предметы и размещать их в проходах запрещено.'
  },
  {
    ask: 'Как добраться до Планетария?',
    content: 'Наш адрес: г. Минск, ст. м. "Площадь Победы", ул. Фрунзе, 2, к.6. Комплекс зданий Планетария и Обсерватории находится в Центральном детском парке имени М. Горького.'
  },
  {
    ask: 'Возможно ли купить билеты заранее?',
    content: 'Для индивидуальных лиц система бронирования не предусмотрена, билеты нельзя приобрести через интернет. Предварительная продажа билетов в кассе не осуществляется, за исключением некоторых проектов и мероприятий, о чем сообщается на официальном сайте и в социальных сетях.'
  },
  {
    ask: 'Возможно ли посещение с маленькими детьми?',
    content: 'Сеансы в Планетарии имеют разный рекомендуемый возраст, в зависимости от содержания программы. Посещение сеансов с детьми до 3 лет, а также людям со слабым вестибулярным аппаратом не рекомендовано, поскольку сеанс проводится в полной темноте, с высоким эффектом присутствия, что может вызвать дискомфорт. За возможные последствия администрация ответственности не несет. Если ребенок заплачет, администрация имеет право попросить вас покинуть зал, чтобы не мешать другим посетителям. Деньги за оплаченные услуги в данном случае зрителю не возмещаются.'
  }
]

export interface Questions {
  ask: string,
  content: string
}


export let planets: Planets[] = [
  {
    img: 'assets/images/mercury.png',
    name: 'Меркурий'
  },
  {
    img: 'assets/images/venera.png',
    name: 'Венера'
  },
  {
    img: 'assets/images/earth.png',
    name: 'Земля'
  },
  {
    img: 'assets/images/mars.png',
    name: 'Марс'
  },
  {
    img: 'assets/images/jupiter.png',
    name: 'Юпитер'
  },
  {
    img: 'assets/images/saturn.png',
    name: 'Сатурн'
  },
  {
    img: 'assets/images/uran.png',
    name: 'Уран'
  }
]
