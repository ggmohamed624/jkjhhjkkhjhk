const form = document.getElementById("item-form");
const input = document.getElementById("item-input");
const list = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filter = document.getElementById("filter");
const formBtn = form.querySelector('button');

let isEditMode = false;


function displayFromStorage(){
    const items = getItemsFromLocalStorage();

    items.forEach(item=>{
        addItemToDom(item);

    })

    checkUi();
}
//event listeners
function onAddItemSubmit(e) {
  e.preventDefault();
  let itemValue;
  itemValue = input.value;

  if (itemValue === "") {
    alert("please enter a value");
    return;
  }


  if(isEditMode){
    const itemToedit =list.querySelector('.item-edit');
    removeFromStorage(itemToedit.textContent);
    itemToedit.classList.remove('item-edit');
    itemToedit.remove();
    isEditMode = false;

  } else {
    if(checkItemExist(itemValue)){
      alert('that item already exists');
      return;
    }
  }

  addItemToDom(itemValue);
  addToLocalStorage(itemValue);


}

function addItemToDom(item){
    const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  list.appendChild(li); 
  input.value = "";


  checkUi();

}

function addToLocalStorage(item){
    itemsFromStorage = getItemsFromLocalStorage();

    itemsFromStorage.push(item);

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function getItemsFromLocalStorage(){
    let itemsFromStorage;
    itemsFromStorage = localStorage.getItem('items');
   if(itemsFromStorage === null){
       itemsFromStorage = []
   }else{
       itemsFromStorage = JSON.parse(localStorage.getItem('items'));
   }

   return itemsFromStorage;
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function onClickList(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);

  } else {
    editItem(e.target);
  }

}

function editItem(item){
  list.querySelectorAll('li').forEach(item=>{
    item.classList.remove('item-edit');
  })
  isEditMode = true;
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Edit Item';
  formBtn.style.backgroundColor = 'blue';
  item.classList.add('item-edit');
  input.value = item.textContent;


}

function removeItem(item){
    if (confirm("are you sure?")) {
        item.remove();
      }

      removeFromStorage(item.textContent);
  checkUi();
}

function removeFromStorage(item1){
   let itemsFromStorage  = getItemsFromLocalStorage();
   itemsFromStorage = itemsFromStorage.filter(item=>item!= item1);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearAll(e) {
  if (confirm("are you sure")) {
    while (list.firstChild) {
      list.firstChild.remove();
    }

  }

  localStorage.removeItem('items');

  checkUi();
}

function filterItems(e){
    const listItems = document.querySelectorAll("li");
    const text = e.target.value.toLowerCase();

    listItems.forEach(item=>{
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1){
            item.style.display='flex';
        }else {
            item.style.display='none';
        }
    })



}

function checkItemExist(item){
  const itemsFromStorage = getItemsFromLocalStorage();
  return itemsFromStorage.includes(item);
}

function checkUi() {
  const listItems = document.querySelectorAll("li");
  if (listItems.length === 0) {
    clearBtn.style.display = "none";
    filter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filter.style.display = "block";
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> add item';
  formBtn.style.backgroundColor = '#333';



  isEditMode = false;
}
form.addEventListener("submit", onAddItemSubmit);
list.addEventListener("click", onClickList);
clearBtn.addEventListener("click", clearAll);
filter.addEventListener('input',filterItems);
document.addEventListener('DOMContentLoaded',displayFromStorage);

checkUi();
