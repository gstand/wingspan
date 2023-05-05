$(document).on('click', '#deleteAll', function(e) {
		e.preventDefault();
		// Confirm tardy submission - Last chance.
		var newDiv = $(document.createElement('div')); 
		newDiv.html("<p>This will delete ALL users of this type and upload new users. They will lose all customization.");
		newDiv.dialog();
		
		// Modal Dialog to confirm tardy. Trigger Submit on Confirm.
		$( newDiv ).dialog({
			resizable: false,
			height: "auto",
			width: 'auto',
			modal: true,
			position: {my:"center top", at: "center top", of: "body" },
			buttons: {
				"Confirm": function() {
					$('#deleteAll').prop('checked', true);
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$('#deleteAll').prop('checked', false);
					$( this ).dialog( "close" );
				}
			}
		});
});
$(document).on('click', '#requireReset', function(e) {
		e.preventDefault();
		// Confirm tardy submission - Last chance.
		var newDiv = $(document.createElement('div')); 
		newDiv.html("<p>This will require ALL users of this type to reset their passwords when they log in again. </p><p>This is painful and should only be done with good reason.</p><p>New users will always be required to reset their passwords.</p>");
		newDiv.dialog();
		
		// Modal Dialog to confirm tardy. Trigger Submit on Confirm.
		$( newDiv ).dialog({
			resizable: false,
			height: "auto",
			width: 'auto',
			modal: true,
			position: {my:"center top", at: "center top", of: "body" },
			buttons: {
				"Confirm": function() {
					$('#requireReset').prop('checked', true);
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$('#requireReset').prop('checked', false);
					$( this ).dialog( "close" );
				}
			}
		});
});
$(document).on('click', '#fileFieldLink', function(e) {
	e.preventDefault();
	if ($("#fileFieldInfo").hasClass('hidden')){
		$('#fileFieldInfo').removeClass('hidden');
		$('#fileFieldLink').html("Hide Field Info");
	}
	else {
		$('#fileFieldInfo').addClass('hidden');
		$('#fileFieldLink').html('Fields for File');
	}
});