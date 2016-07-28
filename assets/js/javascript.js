Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

document.querySelector('input[type=date]').value = new Date().toDateInputValue();
$("select[name='start-hour']").click();

function exportTableToCSV($table, filename) {
    var $rows = $table.find('tr:has(td)'),

        // Temporary delimiter characters unlikely to be typed by keyboard
        // This is to avoid accidentally splitting the actual contents
        tmpColDelim = String.fromCharCode(11), // vertical tab character
        tmpRowDelim = String.fromCharCode(0), // null character

        // actual delimiter characters for CSV format
        colDelim = '","',
        rowDelim = '"\r\n"',

        // Grab text from table into CSV formatted string
        csv = '"' + $rows.map(function (i, row) {
            var $row = $(row),
                $cols = $row.find('td');

            return $cols.map(function (j, col) {
                var $col = $(col),
                    text = $col.text();

                return text.replace(/"/g, '""'); // escape double quotes

            }).get().join(tmpColDelim);

        }).get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim) + '"',

        // Data URI
        csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    $("#ok").attr({
        'download': filename,
            'href': csvData,
            'target': '_blank'
    });

    //window.location.assign(csvData);
    //$(location).attr({'download': filename, 'href': csvData});
    location.reload();
}

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
var place = document.querySelector('input[name=place]');
var calender = "";
var smsOn = false;
var emailOn = false;

// SMS click
$(".smsClick").on("click", function() {
    if (smsOn == false) smsOn = true;
    else smsOn = false;
});

// Email click
$(".emailClick").on("click", function() {
    if (emailOn == false) emailOn = true;
    else emailOn = false;
    console.log(emailOn);
});

// Calender click
$(".calenderClick").on("click", function() {
    if (calender == "") calender = "google";
    else calender = "";
});

function sendData()
{
    // Check everything
    if (checkForm())
    {
        if (smsOn == false) phoneText = "";
        else phoneText = phone.value;

        if (emailOn == false) emailText = "";
        else emailText = email.value;

        var dataToSend = {
            "email": emailText,
            "phonenumber": phoneText,
            "date": date.value,
            "place": place.value,
            "start": time_start_hour.value + ":" + time_start_minutes.value + ":00",
            "end": time_end_hour.value + ":" + time_end_minutes.value + ":00"
        };

        $.ajax({
            "crossDomain": true,
            "url": "http://api.kleinpas.be/add",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": dataToSend
        }).done(function (response) {
            showMessage('Hoera!', 'Bedankt om kleinpas te gebruiken!\nU krijgt een herinnering een week voor de gekozen datum.');
            console.log(response);
        });
    }

}

function formatDate(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear() + '/' + pad(d.getMonth()+1) + '/' + pad(d.getDate())
}

function checkForm()
{
    // console.log("checking data");

    // Remove spaces in phone
    var phonenumber = phone.value;
    for(i = 0; i < phonenumber.length; i++)
    {
        var phonenumber = phonenumber.replace(" ", "");
    }

    if (calender != "" || phonenumber != "" || email.value != "")
    {
        if (smsOn == false && emailOn == false && calender == "")
        {
            showMessage('Sorry . . .', 'We kunnen je alleen verwittigen als je een telefoonnummer of e-mailadres invult, of een kalenderuitnodiging selecteert.');
            // console.log('%cERROR: insert either calender, phone or email.', 'color: red');
            return false;
        }
        else
        {
            if (phonenumber != "")
            {
                if (isNaN(phonenumber) || phonenumber.length != 10)
                {
                    // console.log('%cERROR: phonenumber isnt a number!', 'color: red');
                    showMessage('Sorry . . .', 'We denken dat je telefoonnummer een foutje bevat. Kijk je het even na?');
                    return false;
                }
                else
                {
                    // console.log('%cSUCCESS: phonenumber is fine!', 'color: green');
                }
            }

            if (email.value != "")
            {
                if (email.value.indexOf('@') < 1)
                {
                    // console.log('%cERROR: email isnt an email!', 'color: red');
                    showMessage('Sorry . . .', 'We denken dat je e-mailadres een foutje bevat. Kijk je het even na?');
                    return false;
                }
                else
                {
                    // console.log('%cSUCCESS: email is fine!', 'color: green');
                }
            }

            // console.log("checking date");
            if (date.value != "")
            {
                // Check if date hasnt passed yet
                var inputDate = new Date(date.value);
                var todaysDate = new Date();

                if (inputDate.setHours(0,0,0,0) > todaysDate.setHours(0,0,0,0))
                {
                    // Setup data for calender
                    if (calender == "google")
                    {
                        $(".Start_Date_Later").html(date.value);

                        if (parseInt(time_end_hour.value) < parseInt(time_start_hour.value))
                        {
                            // Event lasts untill next day
                            var newdate = new Date(date.value);
                            newdate.setDate(newdate.getDate() + 1);
                            $(".End_Date_Later").html(formatDate(newdate));
                            // console.log(formatDate(newdate));
                        }
                        else
                        {
                            $(".End_Date_Later").html(date.value);
                        }

                        $(".Start_Time").html(time_start_hour.value + ":" + time_start_minutes.value);
                        $(".End_Time").html(time_end_hour.value + ":" + time_end_minutes.value);

                        // Reduce a week
                        var today = new Date(date.value);
                        var lastWeekDate = new Date(today.setDate(today.getDate() - 7));
                        var formattedDate = formatDate(lastWeekDate);

                        $(".Start_Date").html(formattedDate);

                        if (parseInt(time_end_hour.value) < parseInt(time_start_hour.value))
                        {
                            // Event lasts untill next day
                            var newdate = new Date(formattedDate);
                            newdate.setDate(newdate.getDate() + 1);
                            $(".End_Date").html(formatDate(newdate));
                            // console.log(formatDate(newdate));
                        }
                        else
                        {
                            $(".End_Date").html(formattedDate);
                        }

                        // Click event export
                        $("#ok").parent().addClass("export");
                        $("#ok").parent().attr("href", "#");
                        $("#ok").children().text("Downloaden");

                        $(".export").on('click', function (event) {
                            exportTableToCSV.apply(this, [$('#dvData_google>table'), 'kleinpas.csv']);//'+place.value+'
                            $("#ok").children().text("OK");
                        });
                    }

                    // SEND THE DATA
                    // console.log('%cSUCCESS: everything is fine!', 'background: green; color: white;');
                    return true;
                }
                else
                {
                    // console.log('%cERROR: that day has already passed.', 'color: red;');
                    showMessage('Sorry . . .', 'Die dag is al gepasseerd. Vul je alsjeblieft een datum in de toekomst in?');
                    return false;
                }

            }
            else
            {
                showMessage('Sorry . . .', 'Het lijkt er op dat je geen datum hebt ingevuld. Om je te herinneren hebben we die wel nodig. Vul je hem aan?');
                // console.log('%cERROR: pick a date! ', 'color: red');
                return false;
            }
        }
    }
    else
    {
        showMessage('Sorry . . .', 'We kunnen je alleen verwittigen als je een telefoonnummer of e-mailadres invult, of een kalenderuitnodiging selecteert.');
        // console.log('%cERROR: insert either calender, phone or email.', 'color: red');
        return false;
    }
}
