# jdbc

 参考：https://www.yiibai.com/jdbc/jdbc-transactions.html



如果JDBC连接处于自动提交模式，默认情况下，则每个SQL语句在完成后都会提交到数据库。

对于简单的应用程序可能没有问题，但是有三个原因需要考虑是否关闭自动提交并管理自己的事务 -

- 提高性能
- 保持业务流程的完整性
- 使用分布式事务

事务能够控制何时更改提交并应用于数据库。 它将单个SQL语句或一组SQL语句视为一个逻辑单元，如果任何语句失败，整个事务将失败。

要启用手动事务支持，而不是使用JDBC驱动程序默认使用的自动提交模式，请调用`Connection`对象的`setAutoCommit()`方法。 如果将布尔的`false`传递给`setAutoCommit()`，则关闭自动提交。 也可以传递一个布尔值`true`来重新打开它。

例如，如果有一个名为`conn`的`Connection`对象，请将以下代码关闭自动提交 -

```java
conn.setAutoCommit(false);
Java
```

## 提交和回滚

完成更改后，若要提交更改，那么可在连接对象上调用`commit()`方法，如下所示：

```java
conn.commit( );
Java
```

否则，要使用连接名为`conn`的数据库回滚更新，请使用以下代码 -

```java
conn.rollback( );
Java
```

以下示例说明了如何使用提交和回滚对象 -

```java
try{
   //Assume a valid connection object conn
   conn.setAutoCommit(false);
   Statement stmt = conn.createStatement();

   String SQL = "INSERT INTO Employees  " +
                "VALUES (106, 20, 'Rita', 'Tez')";
   stmt.executeUpdate(SQL);  
   //Submit a malformed SQL statement that breaks
   String SQL = "INSERTED IN Employees  " +
                "VALUES (107, 22, 'Sita', 'Singh')";
   stmt.executeUpdate(SQL);
   // If there is no error.
   conn.commit();
}catch(SQLException se){
   // If there is any error.
   conn.rollback();
}
Java
```

在这种情况下，上述`INSERT`语句不会成功执行，因为所有操作都被回滚了。

为了更好的理解，建议学习研究“[事务提交示例代码](http://www.yiibai.com/jdbc/commit-rollback.html)”。

## 使用保存点

新的JDBC 3.0新添加了`Savepoint`接口提供了额外的事务控制能力。大多数现代DBMS支持其环境中的保存点，如Oracle的PL/SQL。

设置保存点(`Savepoint`)时，可以在事务中定义逻辑回滚点。 如果通过保存点(`Savepoint`)发生错误时，则可以使用回滚方法来撤消所有更改或仅保存保存点之后所做的更改。

`Connection`对象有两种新的方法可用来管理保存点 -

- **setSavepoint(String savepointName):** - 定义新的保存点，它还返回一个`Savepoint`对象。
- **releaseSavepoint(Savepoint savepointName):**  - 删除保存点。要注意，它需要一个`Savepoint`对象作为参数。 该对象通常是由`setSavepoint()`方法生成的保存点。

有一个*rollback (String savepointName)*方法，它将使用事务回滚到指定的保存点。

以下示例说明了使用`Savepoint`对象 -

```java
try{
   //Assume a valid connection object conn
   conn.setAutoCommit(false);
   Statement stmt = conn.createStatement();

   //set a Savepoint
   Savepoint savepoint1 = conn.setSavepoint("Savepoint1");
   String SQL = "INSERT INTO Employees " +
                "VALUES (106, 24, 'Curry', 'Stephen')";
   stmt.executeUpdate(SQL);  
   //Submit a malformed SQL statement that breaks
   String SQL = "INSERTED IN Employees " +
                "VALUES (107, 32, 'Kobe', 'Bryant')";
   stmt.executeUpdate(SQL);
   // If there is no error, commit the changes.
   conn.commit();

}catch(SQLException se){
   // If there is any error.
   conn.rollback(savepoint1);
}
Java
```

在这种情况下，上述`INSERT`语句都不会成功，因为所有操作都被回滚了。





以下是使用事务教程中描述的`setSavepoint`和回滚的代码示例。

此示例代码是基于前面章节中完成的环境和数据库设置编写的。

复制并将以下示例代码保存到：*JDBCSavepoint.java* 中，编译并运行如下 -

```java
//STEP 1. Import required packages
// See more detail at http://www.yiibai.com/jdbc/

import java.sql.*;

public class JDBCSavepoint {
   // JDBC driver name and database URL
   static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";  
   static final String DB_URL = "jdbc:mysql://localhost/EMP";

   //  Database credentials
   static final String USER = "root";
   static final String PASS = "123456";

public static void main(String[] args) {
   Connection conn = null;
   Statement stmt = null;
   try{
      //STEP 2: Register JDBC driver
      Class.forName("com.mysql.jdbc.Driver");

      //STEP 3: Open a connection
      System.out.println("Connecting to database...");
      conn = DriverManager.getConnection(DB_URL,USER,PASS);

      //STEP 4: Set auto commit as false.
      conn.setAutoCommit(false);

      //STEP 5: Execute a query to delete statment with
      // required arguments for RS example.
      System.out.println("Creating statement...");
      stmt = conn.createStatement();

      //STEP 6: Now list all the available records.
      String sql = "SELECT id, first, last, age FROM Employees";
      ResultSet rs = stmt.executeQuery(sql);
      System.out.println("List result set for reference....");
      printRs(rs);

      // STEP 7: delete rows having ID grater than 104
      // But save point before doing so.
      Savepoint savepoint1 = conn.setSavepoint("ROWS_DELETED_1");
      System.out.println("Deleting row....");
      String SQL = "DELETE FROM Employees " +
                   "WHERE ID = 106";
      stmt.executeUpdate(SQL);  
      // oops... we deleted too wrong employees!
      //STEP 8: Rollback the changes afetr save point 2.
      conn.rollback(savepoint1);

    // STEP 9: delete rows having ID grater than 104
      // But save point before doing so.
      Savepoint savepoint2 = conn.setSavepoint("ROWS_DELETED_2");
      System.out.println("Deleting row....");
      SQL = "DELETE FROM Employees " +
                   "WHERE ID = 107";
      stmt.executeUpdate(SQL);  

      //STEP 10: Now list all the available records.
      sql = "SELECT id, first, last, age FROM Employees";
      rs = stmt.executeQuery(sql);
      System.out.println("List result set for reference....");
      printRs(rs);

      //STEP 10: Clean-up environment
      rs.close();
      stmt.close();
      conn.close();
   }catch(SQLException se){
      //Handle errors for JDBC
      se.printStackTrace();
      // If there is an error then rollback the changes.
      System.out.println("Rolling back data here....");
      try{
         if(conn!=null)
            conn.rollback();
      }catch(SQLException se2){
         se2.printStackTrace();
      }//end try

   }catch(Exception e){
      //Handle errors for Class.forName
      e.printStackTrace();
   }finally{
      //finally block used to close resources
      try{
         if(stmt!=null)
            stmt.close();
      }catch(SQLException se2){
      }// nothing we can do
      try{
         if(conn!=null)
            conn.close();
      }catch(SQLException se){
         se.printStackTrace();
      }//end finally try
   }//end try
   System.out.println("Goodbye!");
}//end main

   public static void printRs(ResultSet rs) throws SQLException{
      //Ensure we start with first row
      rs.beforeFirst();
      while(rs.next()){
         //Retrieve by column name
         int id  = rs.getInt("id");
         int age = rs.getInt("age");
         String first = rs.getString("first");
         String last = rs.getString("last");

         //Display values
         System.out.print("ID: " + id);
         System.out.print(", Age: " + age);
         System.out.print(", First: " + first);
         System.out.println(", Last: " + last);
     }
     System.out.println();
   }//end printRs()
}//end JDBCExample
Java
```

编译并运行结果如下 -

```shell
F:\worksp\jdbc>javac -Djava.ext.dirs=F:\worksp\jdbc\libs JDBCSavepoint.java

F:\worksp\jdbc>java -Djava.ext.dirs=F:\worksp\jdbc\libs JDBCSavepoint
Connecting to database...
Thu Jun 01 02:35:49 CST 2017 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
Creating statement...
List result set for reference....
ID: 100, Age: 28, First: Max, Last: Su
ID: 101, Age: 25, First: Wei, Last: Wang
ID: 102, Age: 35, First: Xueyou, Last: Zhang
ID: 103, Age: 30, First: Jack, Last: Ma
ID: 106, Age: 28, First: Curry, Last: Stephen
ID: 107, Age: 32, First: Kobe, Last: Bryant

Deleting row....
Deleting row....
List result set for reference....
ID: 100, Age: 28, First: Max, Last: Su
ID: 101, Age: 25, First: Wei, Last: Wang
ID: 102, Age: 35, First: Xueyou, Last: Zhang
ID: 103, Age: 30, First: Jack, Last: Ma
ID: 106, Age: 28, First: Curry, Last: Stephen

Goodbye!

F:\worksp\jdbc>
Shell
```

可以看到，上面代码中只回滚到保存点(ROWS_DELETED_1)，所以ID为`106`的这一行记录没有被删除，而ID为`107`的记录因为没有设置回滚点，直接提交删除了。

