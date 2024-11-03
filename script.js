// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, push, set, onValue, update, remove} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlruvttWxqEjYUo6Oozl7r93Wbta2H3nc",
  authDomain: "todo-app-c7430.firebaseapp.com",
  projectId: "todo-app-c7430",
  storageBucket: "todo-app-c7430.firebasestorage.app",
  messagingSenderId: "983268619218",
  appId: "1:983268619218:web:60eb34ec996fdefbd58e0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();

const todoAppCreate = document.querySelector("#todo-app-create");


// Hiển thị thông báo
const showAlert = (content, time = 3000) => {
  if(content)
  {
    const div = document.createElement("div");
    div.setAttribute("class", "alert alert--access");
    div.innerHTML = 
      `<div class="alert__content">${content}</div>
      <div class="alert__close"><i class="fa-solid fa-xmark"></i></div>`;
    const alertList = document.querySelector(".alert-list");
    alertList.appendChild(div);
    //ấn x thì xóa
    const alertClose = alertList.querySelector(".alert__close");
    alertClose.addEventListener("click", () => {
      alertList.removeChild(div);
    });
    //5s thì ẩn
    setTimeout(() => {
      alertList.removeChild(div);
    }, time)
  }
};
// Hết phần hiển thị thông báo




if(todoAppCreate)
{
  todoAppCreate.addEventListener("submit", (even) => {

    //lấy ra giá trị trong ô input
    //hành vi mặc định submit: load lại trang
    even.preventDefault(); // ngăn chặn hành vi mặc định
    const content = todoAppCreate.content.value ; // lấy ra giá trị ô input có name là content

    // lưu vào trong cơ sở dữ liệu
    if(content)
    {
      //lưu trong firebase
      const data = {
        content: content,
        complete: false
      };
      set(push(ref(db, 'todo')), data).then(showAlert("Tạo thành công!", 3000)); // tham chiếu đến vị trí /todo trong cơ sở dữ liệu firebase và chèn data vào , push ở đây tự động tạo ID
      todoAppCreate.content.value = "";
    }
  });  
}



  // Xác nhận xóa
  const confirmDelete = (ID) => {
    // chèn code vào HTML
    const div = document.createElement("div");
    div.setAttribute("class", "confirm-delete");
    div.innerHTML = 
      `<div class="confirm-delete__overlay"></div>
      <div class="box-confirm-delete">
        <div class="box-confirm-delete__content">Bạn có chắc chắn muốn xóa ? </div>
        <div class="box-confirm-delete__button">
          <button class="box-confirm-delete__button--yes box-confirm-delete__button--active">Đồng ý</button>
          <button class="box-confirm-delete__button--no box-confirm-delete__button--active">Hủy</button>
        </div>
        <div class="box-confirm-delete__close"><i class="fa-solid fa-xmark"></i></div>
      </div>`;
    const body = document.querySelector("body");
    body.appendChild(div);
  
    const buttonClose = document.querySelector(".box-confirm-delete__close");
    console.log(buttonClose);
    buttonClose.addEventListener("click", () => {
      body.removeChild(div);
    });
  
    const db = getDatabase();
    const buttonYes = document.querySelector(".box-confirm-delete__button--yes");
    buttonYes.addEventListener("click", () => {
      body.removeChild(div);
      remove(ref(db, '/todo/' + ID)).then(showAlert("Xóa thành công!"));
    });
  
    const buttonNo = document.querySelector(".box-confirm-delete__button--no");
    buttonNo.addEventListener("click", () => {
      body.removeChild(div);
    });
  
    const overlay = document.querySelector(".confirm-delete__overlay");
    overlay.addEventListener("click", () => {
      body.removeChild(div);
    });
    
  }


  // Chỉnh sửa nội dung
  const editContent = (ID) => {
    // Tạo phần tử div chứa nội dung chỉnh sửa và thêm vào HTML
    const div = document.createElement("div");
    div.setAttribute("class", "edit-content");
    div.innerHTML = 
      `<div class="edit-content__overlay"></div>
      <div class="edit-content__content">
        <form class="edit-content__form"> 
          <input type="text" name="contentEdit" placeholder="Nhập công việc ...">
          <button type="submit" class="edit-content__button--active edit-content__button--yes">Xác nhận</button>
          <button type="button" class="edit-content__button--active edit-content__button--no">Hủy</button>
        </form>
        <div class="edit-content__close"><i class="fa-solid fa-xmark"></i></div>
      </div>`;
    
    // Thêm div vào body
    const body = document.querySelector("body");
    body.appendChild(div);
  
    // Xử lý sự kiện đóng popup khi nhấn "X" hoặc overlay
    document.querySelector(".edit-content__close").addEventListener("click", () => {
      body.removeChild(div);
    });
    
    document.querySelector(".edit-content__overlay").addEventListener("click", () => {
      body.removeChild(div);
    });
  
    // Xử lý sự kiện "Hủy" khi nhấn nút "Hủy"
    const buttonNo = document.querySelector(".edit-content__button--no");
    buttonNo.addEventListener("click", () => {
      body.removeChild(div);
    });
  
    // Xử lý sự kiện submit của form
    const todoAppCreate = document.querySelector(".edit-content__form");
    if (todoAppCreate) {
      todoAppCreate.addEventListener("submit", (event) => {
        // Ngăn chặn hành vi submit mặc định
        event.preventDefault();
  
        // Lấy giá trị từ ô input
        const content = todoAppCreate.elements.contentEdit.value;
        
  
        // Xử lý thêm dữ liệu vào cơ sở dữ liệu nếu cần
        if(content) {
          const data = { 
            content: content, 
          };
          update(ref(db, '/todo/' + ID), data).then(showAlert("Cập nhật thành công"));
        }
  
        // Đóng popup sau khi nhấn "Xác nhận"
        body.removeChild(div);
      });
    }
  };
  


    


//lấy ra danh sách trong cơ sở dữ liệu
//onValue có tính chất realtime, cơ sở dl chạy theo thời gian thực, thằng firebase tự động nhận diện, có thay đổi chạy mới luôn
onValue(ref(db, 'todo'), (list) => {
  const htmls = [];
  list.forEach((item) => {
    const keyId = item.key;
    const value = item.val();
    let textComplete = ``;
    if(!value.complete)
    {
      textComplete = `<button class="todo-app__item-button todo-app__item--complete " button-complete="${keyId}"><i class="fa-solid fa-check"></i></button>`;
    }
    else {
      textComplete = `<button class="todo-app__item-button todo-app__item--undo " button-undo="${keyId}"><i class="fa-solid fa-rotate-left"></i></button>`;
    }
    const html = `
      <div class="todo-app__item ${value.complete ? "todo-app__item-complete" : ""}">
        <div class="todo-app__item-content">${value.content}</div>
        <div class="todo-app__item-actions">
          <button class="todo-app__item-button todo-app__item--edit"><i class="fa-regular fa-pen-to-square" button-edit="${keyId}"></i></button>
          ${textComplete}
          <button class="todo-app__item-button todo-app__item--delete" button-delete="${keyId}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
    htmls.push(html);
  })
  htmls.reverse();
  const todoAppList = document.querySelector(".todo-app__list");
  todoAppList.innerHTML = htmls.join("");


  //Tính năng hoàn thành công việc
  const listComplete = document.querySelectorAll("[button-complete]");
  listComplete.forEach(button => {
    button.addEventListener("click", () => {
      //sửa lại trạng thái complete thành true
      const updateData = {
        complete: true,
      }
      const ID = button.getAttribute("button-complete");
      update(ref(db, '/todo/' + ID), updateData).then(showAlert("Đã hoàn thành!", 3000));
    });  
  }) ;



  //tính năng hoàn tác
  const listUndo = document.querySelectorAll("[button-undo]");
  listUndo.forEach(button => {
    button.addEventListener("click", () => {
      //sửa lại trạng thái undo thành true
      const updateData = {
        complete: false,
      }
      const ID = button.getAttribute("button-undo");
      update(ref(db, '/todo/' + ID), updateData).then(showAlert("Hoàn tác", 3000));
    });  
  });

  //xóa bản ghi
  const listDelete = document.querySelectorAll("[button-delete]");
  listDelete.forEach(button => {
    button.addEventListener("click", () => {
      //Xóa bản ghi
      const ID = button.getAttribute("button-delete");
      confirmDelete(ID);
      
    });  
  });
  


  // Tính năng chỉnh sửa
  const listEdit = document.querySelectorAll("[button-edit]");
  listEdit.forEach(button => {
    button.addEventListener("click", () => {
      const ID = button.getAttribute("button-edit");
      //CHỉnh sửa nội dung
      editContent(ID);
    });  
  });
})



