// ==UserScript==
// @name         DS - Advanced View Army
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/adv_view_army/adv_view_army.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/adv_view_army/adv_view_army.js
// @match        *://command.drop-shock.com/view_army.php*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

const TF_COLORS = ['#666600', '#400000', '#005600', '#00008B', '#5a5a5a', '#452040', '#525100', 'purple', '#000f59', '#DC143C']

const KEY_BACKTICK = 96
const KEY_1 = 49
const KEY_2 = 50
const KEY_3 = 51
const KEY_4 = 52
const KEY_5 = 53
const KEY_6 = 54
const KEY_7 = 55
const KEY_8 = 56
const KEY_9 = 57
const KEY_X = 120
const KEY_Q = 113
const KEY_W = 119
const KEY_E = 101
const KEY_R = 114

const KEY_TF_0 = KEY_BACKTICK
const KEY_TF_1 = KEY_1
const KEY_TF_2 = KEY_2
const KEY_TF_3 = KEY_3
const KEY_TF_4 = KEY_4
const KEY_TF_5 = KEY_5
const KEY_TF_6 = KEY_6
const KEY_TF_7 = KEY_7
const KEY_TF_8 = KEY_8
const KEY_TF_9 = KEY_9
const KEY_TF_NONE = KEY_X
const KEY_TOGGLE_TOGGLE = KEY_Q
const KEY_TOGGLE_RESERVE = KEY_W
const KEY_TOGGLE_ARMY = KEY_E
const KEY_TOGGLE_NONE = KEY_R



var units = $('tr.unittext')
function is_commander(tr){
    return tr.find('span:contains(Commander)').length > 0
}

function set_task_force(tr, newtf){
    var tf = tr.find('select')
    tf.val(newtf).change()
}

function toggle(tr){
    tr.children('td[width=120]').children('a')[0].click()
}

function is_reserve(tr){
    var btn = tr.children('td[width=120]').children('a')
    return btn.text().includes('Reserve')
}

function is_army(tr){
    return !is_reserve(tr)
}

function set_reserve(tr){
    if (is_commander(tr))
        return
    else if (is_reserve(tr))
        return
    else
        tr.children('td[width=120]').children('a')[0].click()
}

function set_army(tr){
    if (is_commander(tr))
        return
    else if (is_army(tr))
        return
    else
        tr.children('td[width=120]').children('a')[0].click()
}

/*============================== One-time execution ==============================*/
units.sort(function(a,b) {
    if (is_commander($(a)))
        return false
    if (is_commander($(b)))
        return true

    var a_unit = $(a).children('td.unittextb').children('a').text()
    var b_unit = $(b).children('td.unittextb').children('a').text()

    var a_variant = $(a).children('td.unittextb').children('span').text()
    var b_variant = $(b).children('td.unittextb').children('span').text()

    var a_modslot = $(a).children('td.datetext').children('span')[1].textContent
    var b_modslot = $(b).children('td.datetext').children('span')[1].textContent

    var a_tf = $(a).find('select').val()
    var b_tf = $(b).find('select').val()

    var a_mods = $(a).find('img.imgM')
    var b_mods = $(b).find('img.imgM')

    if (a_unit == b_unit){
        if (a_variant == b_variant){
            if (a_modslot == b_modslot){
                if (a_mods.length == b_mods.length){
                    for (var i = 0; i < a_mods.length; i++){
                        if (a_mods[i].src == b_mods[i].src)
                            continue
                        else return a_mods[i].src > b_mods[i].src
                    }
                    return a_tf >= b_tf
                } else return a_mods.length > b_mods.length
            } else return a_modslot > b_modslot
        } else return a_variant > b_variant
    } else return a_unit > b_unit

}).appendTo('tbody');

//Mouse logger
var mouseDown = false
$(document).mousedown(function(event){mouseDown = true})
$(document).mouseup(function(event){mouseDown = false})


units.mouseenter(function(event){
    event.stopPropagation()
    if (mouseDown){
        var tf_sel = select_tf.val()
        var toggle_sel = select_toggle.val()
        if (tf_sel != 'none'){
            set_task_force($(this), tf_sel)
        }

        if (toggle_sel == 'toggle'){
            toggle($(this))
        } else if (toggle_sel == 'reserve'){
            set_reserve($(this))
        } else if (toggle_sel == 'army'){
            set_army($(this))
        }
    }
})

units.mousedown(function(event){
    var tf_sel = select_tf.val()
    var toggle_sel = select_toggle.val()
    if (tf_sel != 'none'){
        set_task_force($(this), tf_sel)
    }

    if (toggle_sel == 'toggle'){
        toggle($(this))
    } else if (toggle_sel == 'reserve'){
        set_reserve($(this))
    } else if (toggle_sel == 'army'){
        set_army($(this))
    }
})

for (var unit of units){


    var tf = $(unit).find('select')
    var togg = $(unit).children('td[width=120]')

    var tf_read_only = $($.parseHTML('<div></div>'))
    tf_read_only.css('width', 40)
    tf_read_only.css('height', '80%')
    tf_read_only.css('margin-left',10)
    tf_read_only.css('border', '1px blue solid')
    tf_read_only.css('text-align', 'center')
    tf_read_only.css('vertical-align', 'middle')
    tf_read_only.css('line-height', '40px')
    tf_read_only.css('font-size', '28px')
    tf_read_only.text(tf.val())
    tf.change(function(x){
        $(this).next().text($(this).val())
    })
    tf.parent().append(tf_read_only)
    bruteforce_set_color()

    tf.css('display','none')
    togg.css('display','none')
}
/*============================== Function rewrites ==============================*/
function queueCommand_2(myActor,myAction,myTarget) {
    myCommand = myActor + "," + myAction + "," + myTarget;
    commandQueue[(commandQueue.length)] = myCommand
    drawQueue();
}
queueCommand = queueCommand_2

var sending = false
function sendCommand_2(myCommand) {
    commandArray = myCommand.split(',')
    sending = true
    $.post( "process_get_modify.php", { theactor: commandArray[0], theaction: commandArray[1], thetarget: commandArray[2] }, function(data){
		thisactor = commandArray[0];
		thisaction = commandArray[1];
		thistarget = commandArray[2];

		if (thisaction=="toggleall") {
			if (data=="ok") { toggleAllConfirm(parseInt(thisactor),parseInt(thistarget)); }
		} else if (thisaction=="togglearmy") {
			if (data=="ok") { togglearmyConfirm(parseInt(thisactor),thistarget); }
		}

        dequeueCommand(0)
        bruteforce_set_color()
        sending = false
    })
}
sendCommand = sendCommand_2

function bruteforce_set_color(){
    for (var unit of units){
        if (is_commander($(unit))) continue

        var tf = $(unit).children().first().children().val()
        if ($(unit).children().first().next().children('a').text().includes('Army')){
            if (tf == '')
                tf = '0'
            $(unit).css('background', TF_COLORS[parseInt(tf)])
        }
        else{
            $(unit).css('background', '')
        }
    }
}

function changeTF_2(myUnit,myTF) {
    queueCommand(myUnit,'changetf',myTF)
}

changeTF = changeTF_2
function runQueue_2() {
}
runQueue = runQueue_2

setInterval(function(){
	if ((commandQueue.length > 0) && !sending) {
        sendCommand(commandQueue[0])
    }
},50)
/*============================== New GUI Buttons ==============================*/
var select_tf = $($.parseHTML('<select></select>'))
var select_toggle = $($.parseHTML('<select></select>'))
var tf_options = {
    none:{value:'none',text:'none'},
    tf0:{value:'0',text:''},
    tf1:{value:'1',text:1},
    tf2:{value:'2',text:2},
    tf3:{value:'3',text:3},
    tf4:{value:'4',text:4},
    tf5:{value:'5',text:5},
    tf6:{value:'6',text:6},
    tf7:{value:'7',text:7},
    tf8:{value:'8',text:8},
    tf9:{value:'9',text:9}
}
var toggle_options = {
    toggle: {value:'toggle' ,text:'toggle'},
    reserve:{value:'reserve',text:'reserve'},
    army:   {value:'army'   ,text:'army'},
    none:   {value:'none'   ,text:'none'}
}

$.each(tf_options, function (i, item) {
    select_tf.append($('<option>', {
        value: item.value,
        text : item.text
    }));
});

$.each(toggle_options, function (i, item) {
    select_toggle.append($('<option>', {
        value: item.value,
        text : item.text
    }));
});

select_toggle.css('margin-right', 15)
select_tf.css('margin-right', 15)

$('#topActions').prepend(select_toggle)
$('#topActions').prepend(select_tf)

/*============================== Listeners and intervals ==============================*/
$(document).keypress(function(event){
	var keycode = (event.keyCode ? event.keyCode : event.which)
    if (keycode == KEY_TF_0){
        select_tf.val('').change()
    }
    else if (keycode == KEY_TF_1){
        select_tf.val('1').change()
    }
    else if (keycode == KEY_TF_2){
        select_tf.val('2').change()
    }
    else if (keycode == KEY_TF_3){
        select_tf.val('3').change()
    }
    else if (keycode == KEY_TF_4){
        select_tf.val('4').change()
    }
    else if (keycode == KEY_TF_5){
        select_tf.val('5').change()
    }
    else if (keycode == KEY_TF_6){
        select_tf.val('6').change()
    }
    else if (keycode == KEY_TF_7){
        select_tf.val('7').change()
    }
    else if (keycode == KEY_TF_8){
        select_tf.val('8').change()
    }
    else if (keycode == KEY_TF_9){
        select_tf.val('9').change()
    }
    else if (keycode == KEY_TF_NONE){
        select_tf.val('none').change()
    }
    else if (keycode == KEY_TOGGLE_TOGGLE){
        select_toggle.val('toggle').change()
    }
    else if (keycode == KEY_TOGGLE_RESERVE){
        select_toggle.val('reserve').change()
    }
    else if (keycode == KEY_TOGGLE_ARMY){
        select_toggle.val('army').change()
    }
    else if (keycode == KEY_TOGGLE_NONE){
        select_toggle.val('none').change()
    }
});