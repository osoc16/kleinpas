var menudown = document.querySelector("#textme");
var action = document.querySelector("#sms");
var flick = 1;

action.addEventListener("click",doSomething);

function doSomething()
{
    if(flick == 1)
    {
        menudown.style.bottom = '150px'; 
    flick = 0;
    }
    else{
         menudown.style.bottom = '205px'; 
    flick = 1;
    }
    
};

var menudown2 = document.querySelector("#mailme");
var action2 = document.querySelector("#mail");
var flick2 = 1;

action2.addEventListener("click",doSomething2);

function doSomething2()
{
    if(flick2 == 1)
    {
        menudown2.style.bottom = '150px'; 
    flick2 = 0;
    }
    else{
         menudown2.style.bottom = '205px'; 
    flick2 = 1;
    }
    
};