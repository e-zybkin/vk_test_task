import { React, useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { addLocale } from 'primereact/api';
import localeRu from "../../utils/locale/ru.json";
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

function App() {
  const [selectedTower, setSelectedTower] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [date, setDate] = useState(null);
  const [timeBeg, setTimeBeg] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);
  const [comment, setComment] = useState('');
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const towers = [
    { name: 'Башня A', code: 'A' },
    { name: 'Башня B', code: 'B' },
  ]

  useEffect(() => {
    if (selectedTower !== null
      && selectedFloor !== null
      && selectedRoom !== null
      && date !== null
      && timeBeg !== null
      && timeEnd !== null) {
      setIsSaveButtonDisabled(false);
    } else {
      setIsSaveButtonDisabled(true);
    }
  }, [selectedTower,
      selectedFloor,
      selectedRoom,
      date,
      timeBeg,
      timeEnd
  ])

  const generateArr = (value) => {
    const data = [];
    let i = value === 'room' ? 1 : 3;
    const n = value === 'room' ? 10 : 27;
    const text = value === 'room' ? 'комната' : 'этаж';

    while (i <= n) {
      data.push({name: `${i} ${text}`, code: `${i}`});
      i += 1;
    }

    return data;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const meetup = {
      tower: selectedTower.code,
      floor: selectedFloor.code,
      room: selectedRoom.code,
      /*закомментированное на случай, если нужны будут красивые цифры в консоли
      (ну или захочется помучить бэкендеров :D)*/
      date,//: date.toLocaleDateString(),
      timeBeg,//: timeBeg.toLocaleTimeString(),
      timeEnd,//: timeEnd.toLocaleTimeString(),
      comment,
    }

    const meetupJson = JSON.stringify(meetup);

    console.log(meetupJson);
  }

  const clearFields = () => {
    setSelectedTower(null);
    setSelectedFloor(null);
    setSelectedRoom(null);
    setDate(null);
    setTimeBeg(null);
    setTimeEnd(null);
    setComment('');
  }

  addLocale('ru', localeRu.ru)

  return (
    <div className="page">
      <div className="wrapper">
        <div className='conference'>
          <h1 className='conference__header'>
            Заполните форму для бронирования переговорной:
          </h1>

          <form
            className='conference__form'
            onSubmit={handleSubmit}
          >
            <Dropdown
              value={selectedTower}
              options={towers}
              optionLabel="name"
              placeholder='Выберите башню'
              onChange={(e) => setSelectedTower(e.value)}
							required
            />

            <Dropdown
              value={selectedFloor}
              options={generateArr('floor')}
              optionLabel='name'
              placeholder='Выберите этаж'
              onChange={(e) => setSelectedFloor(e.value)}
							required
            />

            <Dropdown
              value={selectedRoom}
              options={generateArr('room')}
              optionLabel='name'
              placeholder='Выберите номер комнаты'
              onChange={(e) => setSelectedRoom(e.value)}
							required
            />

            <div className='conference__dateTime-block'>
              <Calendar
                placeholder='Выберите дату'
                locale='ru'
                className='conference__datePicker'
                value={date}
                onChange={(e) => setDate(e.value)}
                dateFormat='dd/mm/y'
								required
              />

              <Calendar
                className='conference__timePicker'
                placeholder='Время начала'
                locale='ru'
                value={timeBeg}
                onChange={(e) => {
                  const dateB = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    e.value.getHours(),
                    e.value.getMinutes(),
                    e.value.getSeconds()
                  );
                  setTimeBeg(dateB);
                }}
                timeOnly
								required
              />

              <Calendar
                className='conference__timePicker'
                placeholder='Время окончания'
                locale='ru'
                value={timeEnd}
                onChange={(e) => {
                  const dateE = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    e.value.getHours(),
                    e.value.getMinutes(),
                    e.value.getSeconds()
                  );
                  setTimeEnd(dateE);
                }}
                timeOnly
								required = {true}
              />
            </div>


            <InputTextarea
              placeholder='Оставьте комментарий'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              autoResize
            />

            <button
              type='submit'
              className={`conference__save-btn buttons ${isSaveButtonDisabled ? 'conference__save-btn_disabled': ''}`}
              disabled={isSaveButtonDisabled}
            >Отправить</button>

            <button
              type='button'
              className={`conference__clear-btn buttons`}
              onClick={clearFields}
            >Очистить</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
