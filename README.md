![vapaee-telos-dex-shadow.png](./src/assets/img/vapaee-telos-dex-shadow.png)

# Vapaée DEX - source code

current version: BASIC (v1.3.0)

https://vapaee.io


```bash
git clone https://github.com/vapaee/eosio-angular-app.git
cd eosio-angular-app
npm i
```
```bash
cd script
./init.sh
```

------------------

## features for next version - PREMIUM (v2.x.x)

- ### Critical
  - [ ] Responsive PWA
    - [x] generate an event _onResize_ for all panels to subscribe
    - [ ] each panel should be able to calculate the area in which it should be deployed and set a element class that reflects it
    - [ ] each panel must be displayed taking into account the area it has to be deployed (based on the class of the element)
    - [ ] Cell phones design:
      - [ ] _token list panel_: must become a Combobox
      - [ ] _wallet panel_: must become a button (that takes you to account page)
      - [ ] smaller header
      - [ ] _chart panel_: with 100%, height 40%
      - [ ] _order form panel_: two modes:
        - [ ] _info mode_: (default) shows the only the number of own orders and button to display (change mode)
        - [ ] _full mode_: you see the entire form to create an order. Own order list still not seen
          - [ ] Button: show own orders.
          - [ ] Own orders list by default is hidden
      - [ ] _order book panel_: show only 4 (2 of each). Expand button.
      - [x] _history panel_. normal.
- ### Uncritical
  - [x] the height of the _token list panel_ should equal the height of _chart panel_
  - [x] add current version number on the HOME page. Below the subtitle with small print
  - [x] button "deposit" to the right of token balances (temporal solution)
  - [x] Wallet Panel (USD):
    - [x] create service to query Telos price in coingecko regularly.
    - [x] Combobox sup-right (to the right of the title) to choose whether to express everything in USD, TLOS, EUR, EOS, etc ...
    - [x] Button to the right of the title "Deposits" that says "withdraw" that if you touch it, switch to "back to prices"
    - [x] Button to the right of the title "Balances" that says "deposit" that if you touch it, switch to "back to prices"
    - [x] To the right of each deposit or balance put the price in USD. If the previous button is pressed, put a button that says "withdraw" / "deposit"
  - [x] Total balance in USD in the header of the account next to total balance
  - [x] Add max and min of the last 24h for each token
  - [x] Activity feedback on home page: how many users, transactions per day, deposits, withdrawals, earnings
    - [x] Create new table on smart contract to store all user activity
    - [x] Create a new component on home page to show last X activity entries
      - [x] Transactions should appear in color
      - [x] click on name account should redirect to account page
      - [x] click on transaction detail should redirect to trade market page
  - [ ] add and test support for the lynx wallet
- ### Details:
  - [x] add Portugues language (Thanks to Fabiana Cecin)
  - [ ] highlight the WP navbar button
  - [x] change the Beatitude icon (HEART)
  - [x] mouse wheel on the chart must advance faster the further back in time it goes.
  - [x] make the TLOS deposit clickable so it adds the maximum possible order amount from the token Spot Account into the order form (Ryan Jones request)
  - [x] show non-validated tokens in the wallet balance and make them unable to be deposited
- ### Easy bugs
  - [x] there's a bug when calculating the payment
  - [x] the total number of buy orders always displays: 0 orders - 0.0000 TLOS
  - [x] do not show the resource panels or balance when not logged in and with low resolution
  - [x] tokens with more volume should be shown on top on the token list
  - [x] in the _order editor panel_ the loading of the cancels do not correspond well. (buy orders are mixed with sell orders)
  - [x] in the _order editor panel_ sometime own order don't appear. It should update regularly as _history panel_ does.
- ### Hard bugs
  - [x] review the list of own orders within the _order editor panel_ because it doesn't display properly sometimes
  - [ ] check the login button.
    - [ ] show error messages!
    - [ ] throw errors in console
    - [ ] verify if the user does have Telos mainnet configured in the wallet.
  - [x] At the moment infinite listeners are being added to the onresize event but I am not taking them out. They accumulate and degrade the performance, badly.
- ### Wishlist
  - [ ] in the _order editor panel_ to be able to cancel more than one order at a time
  - [x] adapt the text of the WP to reflect the Review Video problem and say that 30K TLOS will be returned back to eosio.saving
  - [x] pass all the code to a new repository dedicated to Vapaée DEX
  - [ ] change the algorithm that calculates the summary and base it on the blockhistory.
  - [ ] cache the blockhistoy data.
  - [x] remember the choice of language (cookie)
  - [x] remember the choice of base currency (cookie)
  - [x] remember the last market visited (in memory) and make the 'Trade' nav button to go there instead allways to CNT/TLOS
  - [ ] add date in history entries
  - [ ] show personal activity in account page