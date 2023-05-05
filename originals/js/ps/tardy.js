var uId, pin, period;

$(document).ready(function(){
	
	$.ajax({url: "scripts/php/ajax/tardy.php?action=form", 
		success: function(result){
			$("#content").html(result);
		}
	});
	
	
	$(document).on('keyup paste', '#idNum', function(e){
		uId = $("#idNum").val();
	});
	
	
	$(document).on('keyup paste', '#pin', function(e){
		pin = $("#pin").val();
	});
	
	
	/*
	
	Accept Detention
	
	*/
	
	$(document).on('click', '.detentionAccept', function(e){
		e.preventDefault();
		var idParts = this.id.split("_");
		var dateStr = idParts[1];
		var idNum = idParts[2];
		var per = idParts[3];
		var totTardies = idParts[4];
		
		$.ajax({
			url: "scripts/php/ajax/tardy.php?action=confirmDetention",
			success: function(result){
				$("#content").html(result);
				countDown(".flash");
			}
		});
		
	});
	
	/*
	
	Select the period.
	
	*/
	
	$(document).on('click', '.periodSelect', function(e) {
		$("#period").val(this.id);
		$('.periodSelect').removeClass("clicked");
		// Confirm tardy submission - Last chance.
		var newDiv = $(document.createElement('div')); 
		newDiv.html('<p>You are about to submit a tardy for ' + this.id.replace("_", "") + ".</p><p>Do not exit the pass until your teacher has seen it.");
		// Modal Dialog to confirm tardy. Trigger Submit on Confirm.
		$( newDiv ).dialog({
			resizable: false,
			height: "auto",
			width: "auto",
			modal: true,
			position: {my:"center top", at: "center top", of: "#sch_header", collision: "none" },
			'buttons': {
				"Confirm": function() {
					process_Submit($("#period").val());
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$('.periodSelect').removeClass("clicked");
					$('#period').val("");
					$( this ).dialog( "close" );
				}
			}
		});
		$([document.documentElement, document.body]).animate({
		scrollTop: $("#sch_header").offset().top}, 1000);
		
	});
	
	/* 
	
	Submit Tardy Action
	
	*/
	
	$(document).on('click', '#tardySubmit', function(e) {
		e.preventDefault();
		
		if (!$("#idNum").val() || !$("#pin").val()) {
			var alertDiv = $(document.createElement('div'));
			alertDiv.html("You must enter both an id number and a pin to continue.");
			$(alertDiv).dialog({
				resizable: false,
				height: "auto",
				width: "auto",
				modal: true,
				'buttons': {
					"OK": function(){
						$(this).dialog('close');
					}
				}
			});
			return false;
		}
		$('#tardySubmit').prop("disabled", true);
		process_Submit();
		$('#tardySubmit').prop("disabled", false);
	});
	$(document).on('click', '.linkChoice', function(e) {
		e.preventDefault();
	});
});

/* 

Process Submission

*/

function process_Submit(period){

	$("#tardySubmit").prop("disabled", true);
	
	// If period hasn't been selected, add schedule for selection. 
	if (period == "" || !period) {
		$("#scheduleSection").html("<span><img src=\"media/images/wait.gif\" /></span>");
		
		$.ajax({
			url: "scripts/php/ajax/tardy.php?action=getSchedule&idNum=" + uId + "&pin=" + pin,
			success: function(schResult){
				if (schResult == 0) {
					$.ajax({
					url: "scripts/php/ajax/tardy.php?action=form&error=noSchedule", 
					success: function(errResult){
						
						$("#content").html(errResult);
						$(".error").removeClass("hidden");
					}
				});
				} else {
					$(".error").addClass("hidden");
					$("#scheduleSection").html(schResult);	
				}
			}
		});
	}
	else {
		$("#" + this.id).addClass("clicked");
		$("#content").html("<span><img class=\"wait\" src=\"media/images/wait.gif\" /></span>");
		$.ajax({
			url: "scripts/php/ajax/tardy.php?action=process&idNum=" + uId + "&pin=" + pin + "&period=" + period,
			success: function(result){
				if (result == "0") {
					$.ajax({
						url: "scripts/php/ajax/tardy.php?action=form&error=user", 
						success: function(errResult){
							$("#content").html(errResult);
							$(".error").removeClass("hidden");
						}
					});
				} else {
					$("#content").html(result);	
					$(".error").addClass("hidden");
					countDown(".flash");
				}
			}
		});
	}
}

/* 

Red Flash to guard against screen captures.

*/
function flash(element){
	for (var i = 120; i > 0; i--){
		$(element).fadeOut(500);
		$(element).fadeIn(500);
	}
}
function countDown(element){
	flash(element);

	var expireTime = moment(new Date()).add(2, 'm').toDate();
	
	
	
	$("#tardyCountDown").countdown(expireTime, function(event) {
    $(this).text(
      event.strftime("Pass Expires in: " + '%M:%S')
    );
	if (event.elapsed) {
		location.reload();
	}
  });

}