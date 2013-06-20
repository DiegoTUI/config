'use strict';
/*
 * Atlas requests and description maps.
 *
 * Copyright (C) 2013 TuiInnovation.
 */


/**
 * Pseudo-global to store Atlas requests and description maps
 */
 var atlas = {
	url: 'http://212.170.239.71/appservices/http/FrontendService',
	testRequest : '<TicketAvailRQ echoToken="DummyEchoToken" sessionId="DummySessionId" \
		xmlns="http://www.hotelbeds.com/schemas/2005/06/messages" \
  		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
  		xsi:schemaLocation="http://www.hotelbeds.com/schemas/2005/06/messages TicketAvailRQ.xsd"> \
  <Language>ENG</Language> \
  <Credentials> \
    <User>ISLAS</User> \
    <Password>ISLAS</Password> \
  </Credentials> \
  <PaginationData itemsPerPage="25" pageNumber="1"/> \
  <ServiceOccupancy> \
    <AdultCount>1</AdultCount> \
    <ChildCount>0</ChildCount> \
  </ServiceOccupancy> \
  <Destination code="PMI" type="SIMPLE"/> \
  <DateFrom date="20130819"/> \
  <DateTo date="20130819"/> \
</TicketAvailRQ>'	
};

//export module
module.exports = atlas;