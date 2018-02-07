context( 'Bulk Geocoder', () => {
    specify( 'Uploads and reads data file', () => {
        cy.visit( 'http://localhost:3000/tools/BulkGeocoder' );
        cy.get();
        cy.get( '#upload-button' ).click();
        cy.fixture( '../fixtures/BulkGeocoder/zips.csv' );
        // cy.contains( 'type' ).click();
        // cy.url().should( 'include', '/commands/actions' );
        // cy.get( '.action-email' )
        //     .type( 'fake@gmail.com' )
        //     .should( 'have.value', 'fake@gmail.com' );
    } );
} );
