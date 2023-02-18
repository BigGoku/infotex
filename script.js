let url = './data.json';
let tbody;
let header = document.getElementsByTagName('th'); 
let rowsArray;
//размер страницы
let pageSize = 10;
//текущая страница
let curPage = 1;
let dataRows = [];


fetch (url)
.then(response  => response.json())
.then(data  => {
        dataRows = data
        renderTable(dataRows);
})
.then(() => {

        document.getElementById('nextButton').addEventListener('click', nextPage);
        document.getElementById('prevButton').addEventListener('click', previousPage);
        function previousPage() {
                if(curPage > 1) curPage--;
                renderTable(dataRows);
        }

        function nextPage() {
          if((curPage * pageSize) < dataRows.length) curPage++;
          renderTable(dataRows);
        }
});

//отрисовка таблицы
function renderTable(data) {
        tbody = document.getElementsByTagName("tbody");
        let rw = document.getElementsByClassName("row");

        //удаление строк таблицы перед отрисовкой её страницы
        while(rw[0]) {
                rw[0].parentNode.removeChild(rw[0]);
        }

        let columnCheck = document.getElementsByClassName("showHideCol");
        data.filter((row, index) => {
                let start = (curPage-1)*pageSize;
                let end =curPage*pageSize;
                if(index >= start && index < end) return true;
        }).forEach(el => {
                let tr = document.createElement('tr');
                tr.classList.add("row");
                let td1 = document.createElement('td');
                td1.innerHTML = el.name.firstName;
                td1.classList.add("nameCol");
                if(!columnCheck[0].checked) {
                        td1.style.display = "none";
                }
                let td2 = document.createElement('td');
                td2.innerHTML = el.name.lastName;
                td2.classList.add("lastNameCol");
                if(!columnCheck[1].checked) {
                        td2.style.display = "none";
                }
                let td3 = document.createElement('td');
                td3.innerHTML = el.about;
                td3.classList.add("aboutCol");
                if(!columnCheck[2].checked) {
                        td3.style.display = "none";
                }
                let td4 = document.createElement('td');
                td4.classList.add("eyeColorCol");
                //td4.innerHTML = el.eyeColor;
                td4.style.background = el.eyeColor;
                if(!columnCheck[3].checked) {
                        td4.style.display = "none";
                }
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tbody[tbody.length - 1].appendChild(tr);
        })

        //форма и её поля
        let formEdit = document.getElementById("formEdit");
        let nameText = document.getElementById("nameText");
        let lastNameText = document.getElementById("lastNameText");
        let aboutText = document.getElementById("aboutText");
        let eyeColorText = document.getElementById("eyeColorText");

        //кнопка сохранения
        let saveButton = document.getElementById("save");
        //кнопка отмены
        let cancelButton = document.getElementById("cancel");
        //строка выбранная для изменения
        let str;
        //старое значение строки
        let oldValue = [];

        tbody = document.querySelector('tbody');
        rowsArray = Array.from(tbody.rows);
        for(let i = 0; i < rowsArray.length; i++) {
                rowsArray[i].addEventListener('click', showForm);
        }

        //показ формы редактирования
        function showForm () {
                str = this;
                oldValue = [];
                for(let i = 0; i < this.cells.length; i++) {
                        oldValue.push(this.cells[i].innerHTML);
                }

                //заполнение формы
                formEdit.style.display = "block";
                nameText.value = this.cells[0].innerHTML;
                lastNameText.value = this.cells[1].innerHTML;
                aboutText.value = this.cells[2].innerHTML;
                eyeColorText.value = this.cells[3].style.background;
        }

        saveButton.addEventListener('click', savechanges);
        cancelButton.addEventListener('click', cancelchanges);

        //сохранение изменений
        function savechanges () {


                str.cells[0].innerHTML = nameText.value;
                str.cells[1].innerHTML = lastNameText.value;
                str.cells[2].innerHTML = aboutText.value;
                str.cells[3].style.background = eyeColorText.value;
        }

        //отмена изменений
        function cancelchanges () {
                for(let i = 0; i < str.cells.length; i++) {
                        str.cells[i].innerHTML = oldValue[i];
                }
        }
}



// Порядок сортировки
let ordASC = 1;
// Сортируемое поле
let ordField = '';

for (let i = 0; i < header.length; i++) {
    header[i].addEventListener('click', sortTable);
}

//сортировка
function sortTable(e) {
    tbody = document.querySelector('tbody');
    rowsArray = Array.from(tbody.rows);
    selectOrd(e.target.id);

    //сортировка для каждого столбца
    switch (e.target.id) {
        case 'name':
            compare = function(rowA, rowB) {
            return (rowA.cells[0].innerHTML > rowB.cells[0].innerHTML ? 1 : -1) * ordASC;
                };
        break;
        case 'lastName':
            compare = function(rowA, rowB) {
            return (rowA.cells[1].innerHTML > rowB.cells[1].innerHTML ? 1 : -1) * ordASC;
                };
        break;
        case 'about':
            compare = function(rowA, rowB) {
            return (rowA.cells[2].innerHTML > rowB.cells[2].innerHTML ? 1 : -1) * ordASC;
                };
        break;
        case 'eyeColor':
            compare = function(rowA, rowB) {
            return (rowA.cells[3].style.background > rowB.cells[3].style.background ? 1 : -1) * ordASC;
                };
            // сортировка по innerHtml   
            // compare = function(rowA, rowB) {
            // return (rowA.cells[3].innerHTML > rowB.cells[3].innerHTML ? 1 : -1) * ordASC;
            //     };
        break;
    }
    // сортировка
    rowsArray.sort(compare);
    tbody.append(...rowsArray);
}

//изменение направления сортировки
function selectOrd(id) {
    if (id === ordField) {
        ordASC *= -1;
    } else {
        ordField = id;
        ordASC = 1;
    }
}

//флажки с названием столбцов
let checkBox = document.getElementsByClassName("showHideCol");

for (let i = 0; i < checkBox.length; i++) {
    checkBox[i].addEventListener('click', showHideColumn);
}

//скрытие показ колонки
function showHideColumn () {
        let column = document.getElementsByClassName(this.value)
        if (this.checked) {
                for (let i = 0; i < column.length; i++) {
                column[i].style.display = "table-cell";
                if (column[i].className == "aboutCol" && column[i].tagName == "TD") column[i].style.display = "-webkit-box";
                }
        }
        else {
                for (let i = 0; i < column.length; i++) {
                column[i].style.display = "none";
                }
        }
}