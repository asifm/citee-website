context( 'My first proper test', () => {
    specify( 'Visits kitchen sink', () => {
        // cy.visit( 'http://localhost:3000/tools/BulkGeocoder' );
        cy.visit( '/' );
        // cy.get( '#selectFile' ).click();
        // cy.contains( 'type' ).click();
        // cy.url().should( 'include', '/commands/actions' );
        // cy.get( '.action-email' )
        //     .type( 'fake@gmail.com' )
        //     .should( 'have.value', 'fake@gmail.com' );
    } );
} );
