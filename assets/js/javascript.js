/*var menudown = document.querySelector("#textme");
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
    
};*/

(function() {

})();

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

// Message window
function showMessage(title, message)
{
    $("#window h2").text(title);
    $("#window p").text(message);
    $("#darkness").show();
}

// Messagebox
var okButton = document.querySelector("#ok");
okButton.addEventListener("click", function(){
    $("#darkness").hide();
});

// Sending the data
var submitButton = document.querySelector(".submit");
submitButton.addEventListener("click", sendData);

var date = document.querySelector('input[name=babysit-date]');
var time_start_hour = document.querySelector('select[name=start-hour]');
var time_start_minutes = document.querySelector('select[name=start-minute]');
var time_end_hour = document.querySelector('select[name=end-hour]');
var time_end_minutes = document.querySelector('select[name=end-minute]');
var phone = document.querySelector('input[name=phone]');
var email = document.querySelector('input[name=email]');
// This is temporary
var calender = "";

function sendData()
{
    // Check everything
    if (checkForm())
    {
        var dataToSend = {
            "email": email.value,
            "phonenumber": phone.value,
            "date": date.value,
            "start": time_start_hour.value + ":" + time_start_minutes.value + ":00",
            "end": time_end_hour.value + ":" + time_end_minutes.value + ":00"
        };

        $.ajax({
            "crossDomain": true,
            "url": "http://localhost:8000/add",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": dataToSend
        }).done(function (response) {
            showMessage('Hoera!', 'Bedankt om kleinpas te gebruiken!\nU krijgt een herinnering een week voor de gekozen datum!');
            console.log(response);
        });
    }
}

function checkForm()
{
    console.log("checking data");

    // Remove spaces in phone
    var phonenumber = phone.value;
    for(i = 0; i < phonenumber.length; i++)
    {
        var phonenumber = phonenumber.replace(" ", "");
    }

    if (calender != "" || phonenumber != "" || email.value != "")
    {
        if (phonenumber != "")
        {
            if (isNaN(phonenumber))
            {
                console.log('%cERROR: phonenumber isnt a number!', 'color: red');
                showMessage('Oops!', 'Dat is geen geldig telefoonnummer!');
                return false;
            }
            else
            {
                console.log('%cSUCCESS: phonenumber is fine!', 'color: green');
            }
        }

        if (email.value != "")
        {
            if (email.value.indexOf('@') < 1)
            {
                console.log('%cERROR: email isnt an email!', 'color: red');
                showMessage('Oops!', 'Dat is geen geldige email!');
                return false;
            }
            else
            {
                console.log('%cSUCCESS: email is fine!', 'color: green');
            }
        }

        console.log("checking date");
        if (date.value != "")
        {
            // Check if date hasnt passed yet
            var inputDate = new Date(date.value);
            var todaysDate = new Date();

            if (inputDate.setHours(0,0,0,0) > todaysDate.setHours(0,0,0,0))
            {
                // SEND THE DATA
                console.log('%cSUCCESS: everything is fine!', 'background: green; color: white;');
                return true;
            }
            else
            {
                console.log('%cERROR: that day has already passed!', 'color: red;');
                showMessage('Oops!', 'Die dag is al gepasseerd!');
                return false;
            }

        }
        else
        {
            showMessage('Oops!', 'Kies een datum!');
            console.log('%cERROR: pick a date! ', 'color: red');
            return false;
        }
    }
    else
    {
        showMessage('Oops!', 'Noteer een telefoonnummer, email of selecteer een kalendermethode!');
        console.log('%cERROR: insert either calender, phone or email!', 'color: red');
        return false;
    }
}
