const record = document.getElementById("record");

// документ это обьект котрый содержит методы получения элементов а т..к. получаем по id то используем метод getElementById
const shot = document.getElementById("shot");
const hit = document.getElementById("hit");
const dead = document.getElementById("dead");
const enemy = document.getElementById("enemy");
const again = document.getElementById("again");
// В конце игры заголовок будем менять на новый querySelector получает первый элемент который мы запишем в ковычках по #id по классу.точка внизу у header поменяем текст
const header = document.querySelector(".header");
// Создаем обьект который содержит корабли и методы которые будут добавления кораблей на страницу
// Обьект создание кораблей.корабли по координатам и
const game = {
  // новый масив который будет генирировать корабли в игре
  // переменные
  ships: [],
  shipCount: 0,
  optionShip: {
    // количество кораблей
    count: [1, 2, 3, 4],
    // масивы размеров кораблей
    size: [4, 3, 2, 1],
  },
  collision: new Set(),
  // метод генерации кораблей
  generateShip() {
    // будем запускать цикл.Цыклов будет столько должно быть кораблей
    for (let i = 0; i < this.optionShip.count.length; i++) {
      // в цыкле мы будем запускать второй цыкл
      for (let j = 0; j < this.optionShip.count[i]; j++) {
        //  сохдаем корабль
        const size = this.optionShip.size[i];
        // создаю корабль методомgenerateOptionsShip
        const ship = this.generateOptionsShip(size);
        // дальше этот обьект буду пушить
        this.ships.push(ship);
        this.shipCount++;
      }
    }
  },
  // опишем метод создания кораюлейgenerateOptionsShip
  generateOptionsShip(shipSize) {
    const ship = {
      hit: [],
      location: [],
    };
    // переменная которая определяет направление коробля горизонтюили вертикально
    const directon = Math.random() < 0.5;
    let x, y;
    if (directon) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * (10 - shipSize));
    } else {
      x = Math.floor(Math.random() * (10 - shipSize));
      y = Math.floor(Math.random() * 10);
    }

    for (let i = 0; i < shipSize; i++) {
      if (directon) {
        ship.location.push(x + "" + (y + i));
      } else {
        ship.location.push(x + i + "" + y);
      }
      ship.hit.push("");
    }
    if (this.checkCollision(ship.location)) {
      return this.generateOptionsShip(shipSize);
    }
    this.addCollision(ship.location);
    // в конце метода будем возвращать корабль ship
    return ship;
  },
  checkCollision(location) {
    for (const coord of location) {
      if (this.collision.has(coord)) {
        return true;
      }
    }
  },
  addCollision(location) {
    for (let i = 0; i < location.length; i++) {
      const startCoordX = location[i][0] - 1;
      for (let j = startCoordX; j < startCoordX + 3; j++) {
        const startCoordY = location[i][1] - 1;
        for (let z = startCoordY; z < startCoordY + 3; z++) {
          if (j >= 0 && j < 10 && z >= 0 && z < 10) {
            const coord = j + "" + z;

            this.collision.add(coord);


          }
        }
      }
    }
  },
};

// масив с 4 корабля с координатами
// ships: [{
// функция которая генерирует корабли и растовляет на поле

// масив с координатами коробля пример изночальный
// location: ["26", "36", "46", "56"],
// масив будет содержать количество = количеству координат  пустые ячейки по id координатам в эти пустые строчки мы будем добовлять индикатор который когда по кораблю попали
// hit: ["", "", "", ""],},
// { // трехпалубный корабль
// location: ["11", "12", "13"],
// hit: ["", "", ""],},
// {
// location: ["69", "79"],
// hit: ["", ""],},
// {location: ["32"],hit: [""],},
// ],
// счетчик подбитых кораблей у2  23.10
// shipCount: 4,
// метод перебора где корабль устанавливать нельзя

const play = {
  // Чтобы получить рекорд можно в этом методе свойстве record мы обратимся rlocalStorage b будем получать значения - getItem из seaBattleRecord
  // а потом отобразить команда play.render(); в метод init внизу запишем эту команду play.render();

  record: localStorage.getItem("seaBattleRecord") || 0,
  // record: 0,
  shot: 0,
  hit: 0,
  dead: 0,
  // метод к которому обрашаются как к свойству юПринимать будет данные data и передовать в виде наших свойств

  set updateData(data) {
    // свойством this
    this[data] += 1;
    // после this[data] += 1; вызываем у обьекта render вывод на страницу
    this.render();
    // Считает и сохраняет выстрелы(клики)
    //play.shot += 1;
    //play.render();
  },
  // метод который в наши спамчики будет добовлять количество клико(крестики -выстрелы)
  render() {
    record.textContent = this["record"];
    shot.textContent = this.shot;
    hit.textContent = this.hit;
    dead.textContent = this.dead;
  },
};
// запускаем функции

const show = {
  // методы функции
  hit(elem) {
    this.changeClass(elem, "hit");
  },
  // Добавляет крестики класс miss отобразить промах в нутри меняем
  miss(elem) {
    // вызовем другой метод приняв. this (обьект шоу)ссылка на обьект в данном случае  переносим наш элемент elem и перепишем класс
    this.changeClass(elem, "miss");
  },
  dead(elem) {
    this.changeClass(elem, "dead");
  },
  // вызовем другой метод приняв.  в нутри меняем класс
  changeClass(elem, value) {
    elem.className = value;
  },
};
// Запускаем функцию и создается обьект event  и обратимся к свойству таргет
const fire = (event) => {
  const target = event.target;
  // запретить второй выстрел проверим if (target.classList.length не равен !== 0) то будем выполнять return прервет функцию  можно поставить > 0 вместо !== .
  // при попадении в тег tr или  мы ограничим клики тегом td
  if (
    target.classList.length !== 0 ||
    target.tagName !== "TD" ||
    !game.shipCount
  )
    return;
  // обращаемся к show и к методу miss и мы будем передовать наш таргет а в верху в методе miss
  show.miss(target);
  // обращаемся к play и указываем какие данные мы хотим поменять у нас shot
  // play.shot += 1;
  //выводит на страницу рендарет но заменим перенесли на верх в set updateData(data) {
  // свойством this
  // this[data] += 1;
  // после this[data] += 1; вызываем у обьекта render вывод на страницу
  // this.render();
  // play.render();
  //
  play.updateData = "shot";
  // 2 урок 10-43
  // здесь в этой функции когда кликаем по полю будем перебирать все коробли и все координаты и проверять есть ли такие координаты как у нашей ячейки среди кораблей
  // напишем цикл for и задаем переменную i равную 0. и будем проверять нашу переменную на меньшее количество кораблей по масиву ships для константы game.ships.length где length их количество ну и дальше мы должны прибовлять ++ к i 1единицу(для I записан цыкл для проверки масива кораблей ships где идет проверка 0.1.2.3.а 4 уже меньше i ++1(3)цикл проверки закончится)
  for (let i = 0; i < game.ships.length; i++) {
    // создадим константу ship по индексу от 0 до 3 т.к. корабля4 .Чтобы записать корабль проверяем масив game.ships[i] по индексу
    const ship = game.ships[i];
    // создаем вторую переменную index которая будет индекс коробля id коробля для этого мы обратимся к нашему кораблю(перенной) ship и его свойству location и методу indexOf он будет проверять если у масива location определенный id тот который у нашей ячейки(кликнутой) и передадим айди клика через наш target и у него есть свойство id (target.id)
    const index = ship.location.indexOf(target.id);
    // 2 урок 15-35
    // метод индексов если id будет больше или равен 0 значит мы попали по кароблю а если меньше нуля то мы промазоли то оставляем просто выстрел
    if (index >= 0) {
      //  метод обьекта show попали
      show.hit(target);
      // добовляем елиницу хода
      play.updateData = "hit";
      // попадение по караблю отмечаем и вносим
      ship.hit[index] = "x";
      // после попадания будем проверять масив hit есть ли у масива пустые строчки без х . если нет то корабль потоплен
      const life = ship.hit.indexOf("");
      if (life < 0) {
        // подбили корабль
        play.updateData = "dead";
        // теперь нам надо поменять класс
        // show.dead(target);
        // будем пользоваться другим циклом который береберает как обьекты так и масивы создаем константу id(ячейка) и будем перебирать все ячейки по id кораблей location: ['69', '79'],и получать ячейку метод show.dead
        for (const id of ship.location) {
          show.dead(document.getElementById(id));
        }
        // после потапления кораблей
        game.shipCount -= 1;
        if (!game.shipCount) {
          // alert('Игра окончена');
          // меняем текст в заколовке игра окончена
          header.textContent = "Игра окончена";
          // Сделаем текст красным
          header.style.color = "red";

          // запишем условие если текущий рекорд меньше предыдущего
          if (play.shot < play.record || play.record === 0) {
            // то выполним
            // В мы будем хранить данные о рекорде у него есть метод setItemзаписать данные и первым мы запишем строку ключ ceaBattleRecord по котрым мы сможем эти данные потом получать и туда запишем значение инфу из play.shot
            localStorage.setItem("seaBattleRecord", play.shot);
            // выведем на страницу сначала запишем в play.record

            play.record = play.shot;
            // затем выведем yf cnhfybwe
            play.render();
          }
        }
      }
    }
  }
};

// функция которая звпускает игру
// Навешиваем событие движение мышки по игровому полю
const init = () => {
  // Метод addEventListener он позволяет навешать слушателя событияюКогда будет происходить клик будет происходить выстрел вызовем функцию fire
  enemy.addEventListener("click", fire);
  play.render();
  // вызов метода generateShip
  game.generateShip();
  // перезапуск игры .Возьмем кнопку по клику напишем стрелочную функцию  обратимся к обьекту location.reload и методу reload - он перепозапускает страницу
  again.addEventListener("click", () => {
    location.reload();
  });
  // навешиваем событие при нажатие на число в рекорд обнуляем его
  record.addEventListener("dblclick", () => {
    // очищаем localStorage методомclear
    localStorage.clear();
    //  присваеваем 0
    play.record = 0;
    // выводим на сайт
    play.render();
  });
  console.log(game);
};

init();