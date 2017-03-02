# uni_portfolio_website
Developped a portfolio system for students. Each student will be able to register to this website, add his or her works. Works can be screenshots, links to websites or code repositories. A client visiting the portfolio will view summary of student portfolios and can then choose to view the detailed portfolio of one student. Clients who are logged in can rate a student’s work. In addition, a client can search the portfolio to view relevant works.

# Bonus features included in the project:

1- A client visiting the portfolio can choose to view the detailed portfolio of one student.
<p align="center">
  <img src="https://i.imgur.com/213cy5kr.png" />
</p>

2- Clients who are logged in can rate a student’s work.
# when displaying top 2 rated projects in the portfolio summary number of ratings will be taken into considerations
i.e if one project have 50 ratings and its average rating is 4 and another project have 10 ratings with average 5, the first project will be displayed first ;) <br>

screenshots shows that a <strong>non loginned in</strong> client can't rate works, <br>
and client can't rate a work more than once..

<p align="center">
  
  <img src="http://i.imgur.com/zQs3ZYn.png" />
  <img src="http://i.imgur.com/4VBseED.png" />
  <img src="http://i.imgur.com/D7VeEDy.png" />
 
</p>
3- A client can search the portfolio to view relevant works (without reloading page) and categorizing the works (screenshots, code repos. or links).
<p align="center">
  <img src="http://i.imgur.com/SC46lgN.png" />
</p>

4- A student can Update, delete work (unless it's the last work in the portfolio).<br>
5- The password must include 8 characters at least including a digit and a special character when the Password does not meet the above listed requirements, a relevant error message is displayed.<br>
6- when Username already exists, a relevant error message is displayed.<br>
7- Student does not provide username or password when logging in exception. <br>
8- Student has a valid GUC-ID and belongs to either MET or BI. <br>
9- When creating a portfolio Student does not provide mandatory information. Error message is displayed and No portfolio created.<br>
10- Student can't create a portfolio if he has a portfolio already. <br>
11- <strong>Forgot password feature.</strong>

# Additional design features:
1- page loader <br>
2- slideShow for works with screenshots <br>
3- some animations on hovering some elements <br>

# Additional features:
passwords are saved inside the database using hashing and by adding salt to ensure security

