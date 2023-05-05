// Menu Javascript
	var slideout = new Slideout({
		'panel': document.getElementById('panel'),
		'menu': document.getElementById('menu'),
		'padding': 256,
		'tolerance': 70
	});

	// Toggle button
	document.querySelector('.toggle-button').addEventListener('click', function() {
		slideout.toggle();
	});
	// Load login script
	$(document).on('click', '#loginLink', function(e) {
		e.preventDefault();
		slideout.close();
		var loginDiv = $(document.createElement('div'));
		$(loginDiv).delay(300).load("login.php #loginForm", {}, function(){
			$("#l_userName").focus();
		});
		$(loginDiv).dialog({
			resizable: false,
			height: "auto",
			width: 'auto',
			modal: true,
			position: {my:"center center", at: "center center" }
		});
		
	});
	// Log in form submission.
	$(document).on('submit', "#loginForm", function(e) {
		e.preventDefault();
		var call = "ajax";
		var formData = {user: $("#l_userName").val(), pass: $("#l_pass").val()};
		if ($("#loginPageWrapper").length) {
			var call = "redirect";
		}
		$.ajax({
			type: 'POST',
			url: 'scripts/php/login.php?action=login&call=' + call, 
			width: 'auto',
			position: {my: "top center", at: "top center", of: window},
			data: formData,
			success: function(result){
				resultParts = result.split("||");
				resultStatus = resultParts[0];
				resultInfo = resultParts[1];
        alert(resultStatus);
				if (resultStatus == "success"){
					window.location.href = window.location.pathname+"?"+$.param({'notice':'logged_in'})
				}
				else if (resultStatus == "redirect") {
					window.location.href= resultInfo;
				}
				else if (resultStatus == "error") {
					window.scrollTo(0,0);
					$(".ui-dialog-content").dialog("close");
					$("#topNotification").html(resultInfo);
					$("#topNotification").slideDown().css('visibility','visible').slideDown(1000);
					$("#topNotification").delay(3000).fadeOut(500);
			
				}
				else {
					window.scrollTo(0,0);
					$(".ui-dialog-content").dialog("close");
					$("#topNotification").html("There was a problem.");
					$("#topNotification").slideDown().css('visibility','visible').slideDown(1000);
					$("#topNotification").delay(3000).fadeOut(500);
				}
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				alert(err.Message);
}
		})
		
	});
	// Log out
	$(document).on('click', "#logout", function(e) {
		e.preventDefault();
		$.ajax({
			url: 'scripts/php/login.php?action=logout',
			success: function(result){
				window.location.href = window.location.pathname+"?"+$.param({'notice':'logout'})
			}
		});
	});