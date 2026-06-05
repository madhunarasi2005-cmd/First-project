const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const scoreInput = document.getElementById("score");
const idInput = document.getElementById("studentId");
const addBtn = document.getElementById("addBtn");
const studentTable = document.getElementById("studentTable");

let students = [];

const studentMap = new Map();
const uniqueStudents = new Set();

let currentPage = 1;
const recordsPerPage = 5;

let editIndex = -1;


// =====================
// INPUT CHECK
// =====================

function checkInputs(){

    if(
        nameInput.value.trim() !== "" &&
        ageInput.value.trim() !== "" &&
        scoreInput.value.trim() !== "" &&
        idInput.value.trim() !== ""
    ){

        addBtn.disabled = false;
        addBtn.classList.add("active-btn");

    }
    else{

        addBtn.disabled = true;
        addBtn.classList.remove("active-btn");

    }
}

nameInput.addEventListener("input", checkInputs);
ageInput.addEventListener("input", checkInputs);
scoreInput.addEventListener("input", checkInputs);
idInput.addEventListener("input", checkInputs);


// =====================
// ADD STUDENT
// =====================

function addStudent(){

    let name = nameInput.value.trim();

    if(editIndex === -1 && uniqueStudents.has(name)){

        alert("Student already exists");
        return;
    }

    let score = Number(scoreInput.value);

    let grade = "";

    if(score >= 80){

        grade = "A";

    }
    else if(score >= 60){

        grade = "B";

    }
    else if(score >= 40){

        grade = "C";

    }
    else{

        grade = "D";
    }

    let student = {

        name : name,
        age : ageInput.value,
        score : score,
        studentId : BigInt(idInput.value),
        grade : grade

    };


    if(editIndex === -1){

        students.push(student);

        uniqueStudents.add(student.name);

        studentMap.set(
            student.studentId,
            student
        );
    }
    else{

        students[editIndex] = student;

        editIndex = -1;
    }

    displayStudents();

    clearInputs();
}


// =====================
// DISPLAY STUDENTS
// =====================

function displayStudents(){

    while(studentTable.rows.length > 1){

        studentTable.deleteRow(1);
    }

    let start =
    (currentPage - 1) * recordsPerPage;

    let end =
    start + recordsPerPage;

    let pageStudents =
    students.slice(start, end);


    pageStudents.forEach((student, index)=>{

        let row =
        studentTable.insertRow();

        row.insertCell(0).innerHTML =
        start + index + 1;

        row.insertCell(1).innerHTML =
        student.name;

        row.insertCell(2).innerHTML =
        student.age;

        row.insertCell(3).innerHTML =
        student.score;

        row.insertCell(4).innerHTML =
        `<span class="grade ${student.grade}">
            ${student.grade}
        </span>`;

        row.insertCell(5).innerHTML =
        student.studentId;

        row.insertCell(6).innerHTML =

        `
        <button class="update-btn">
            Update
        </button>

        <button class="delete-btn">
            Delete
        </button>
        `;


        const updateBtn =
        row.querySelector(".update-btn");

        const deleteBtn =
        row.querySelector(".delete-btn");


        updateBtn.onclick = function(){

            editStudent(
                start + index
            );
        };


        deleteBtn.onclick = function(){

            deleteStudent(
                start + index
            );
        };

    });

    document.getElementById("pageNumber")
    .innerHTML =
    `Page ${currentPage}`;
}


// =====================
// UPDATE
// =====================

function editStudent(index){

    let student =
    students[index];

    nameInput.value =
    student.name;

    ageInput.value =
    student.age;

    scoreInput.value =
    student.score;

    idInput.value =
    student.studentId.toString();

    uniqueStudents.delete(
        student.name
    );

    editIndex = index;

    addBtn.disabled = false;
}


// =====================
// DELETE
// =====================

function deleteStudent(index){

    uniqueStudents.delete(
        students[index].name
    );

    studentMap.delete(
        students[index].studentId
    );

    students.splice(index, 1);

    displayStudents();
}


// =====================
// NEXT PAGE
// =====================

function nextPage(){

    let totalPages =
    Math.ceil(
        students.length /
        recordsPerPage
    );

    if(currentPage < totalPages){

        currentPage++;

        displayStudents();
    }
}


// =====================
// PREVIOUS PAGE
// =====================

function previousPage(){

    if(currentPage > 1){

        currentPage--;

        displayStudents();
    }
}


// =====================
// CLEAR INPUTS
// =====================

function clearInputs(){

    nameInput.value = "";
    ageInput.value = "";
    scoreInput.value = "";
    idInput.value = "";

    addBtn.disabled = true;

    addBtn.classList.remove(
        "active-btn"
    );
}