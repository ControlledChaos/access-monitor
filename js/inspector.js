jQuery( document ).ready( function( $ ) {
	$( '.am-errors' ).hide();
	$( '#publish[name="publish"], button.inspect-a11y' ).on( 'click', function( e ) {		
		var override = $( '#am_override' ).is( ':checked' );
		if ( override ) {
			// exit without testing
		} else {
			var preview_url = $( '#post-preview' ).attr( 'href' );
			var preview_content = '';
			var preview_container = ( am.container == '' ) ? 'body' : am.container;
			var response_content = '';
			var grade = 0;
			
			e.preventDefault();
			
			$.ajax({
			   url:preview_url,
			   type:'GET',
			   success: function(data){
					preview_content = $(data).find( preview_container ).html();
					if ( !preview_content || preview_content == '' ) {
						preview_content = am.failed;
					}
					
					var query = {
						'action' : am_ajax_action,
						'tenon' : preview_content,
						'current_screen' : am_current_screen,
						'level' : am.level,
						'certainty' : am.certainty,
						'priority' : am.priority,
						'fragment' : '1'
					};
										
					$.ajax({
						data: query,
						url: am_ajax_url,
						dataType: 'json',
						success: function( data ) {
							response_content = data.formatted;
							grade = data.grade;
							if ( grade < am.grade ) {
								$( '#am-errors' ).html( response_content );
								$( '.am-errors .score' ).text( grade.toFixed(2) + '%' );
								$( '.am-errors .am-message' ).html( am.error );								
								$( '.am-errors' ).addClass( 'updated error' ).show().attr( 'tabindex', '-1' ).focus();
							} else {							
								if ( e.target.nodeName == 'INPUT' ) {
									$( '#post' ).submit();
								} else {
									$( '#am-errors' ).html( response_content );
									$( '.am-errors .score' ).text( grade.toFixed(2) + '%' );
									$( '.am-errors .am-message' ).html( am.pass );
									$( '.am-errors' ).addClass( 'updated error' ).show().attr( 'tabindex', '-1' ).focus();
								}
							}
						},
						error: function( data ) {
							/* 
								console.log(data.responseText); 
							*/
							if ( e.target.nodeName == 'INPUT' ) {
								$( '#post' ).submit();
							}
						}	
					});
					
					return false;			   
			   }
			});
		}
	});
	
	$( '#am_notify' ).on( 'click', function( e ) {
		var query = {
			'action'  : am_ajax_notify,
			'user'    : amn.user,
			'post_ID' : amn.post_ID, 
			'security': amn.security
		};	

		$.ajax( {
			type: 'POST',
			url: am_ajax_url,
			data: query,
			dataType: 'json',
			success: function( data ) {
				var response = data.response;
				var message = data.message;
				$( '#am_notified' ).html( message );
			},
			error: function(data) {
				$( '#am_notified' ).html( amn.error );
			}
		});
			
	});	
	
	/*
		$(document).ajaxError( function( event, requests, settings ) {
			console.log( event );
			console.log( requests.responseText );
			console.log( settings );
		});
	*/
	
	$( '.am-toggle' ).on( 'click', function(e) {
		e.preventDefault();
		$( '#am-errors' ).toggle();
		var expanded = $( this ).attr( 'aria-expanded' );
		if ( expanded == 'false' ) {
			$( this ).text( am.hide ).attr( 'aria-expanded', 'true' );
		} else {
			$( this ).text( am.show ).attr( 'aria-expanded', 'false' );			
		}
	});	
});