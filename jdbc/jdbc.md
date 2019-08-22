# jdbc

## ResultSetMetaData

`ResultSetMetaData`有两个方法获取字段名称

1. `getColumnName(int index)`，这个方法获取的是该字段在表内的名称。

2. `getConlumnLabel(int index)`，这个方法获取的是你在语句中要求的该字段的名称





## 批处理

### 使用Statement对象进行批处理

以下是使用`Statement`对象的批处理的典型步骤序列 -

- 使用`createStatement()`方法创建`Statement`对象。
- 使用`setAutoCommit()`将自动提交设置为`false`。
- 使用`addBatch()`方法在创建的`Statement`对象上添加SQL语句到批处理中。
- 在创建的`Statement`对象上使用`executeBatch()`方法执行所有SQL语句。
- 最后，使用`commit()`方法提交所有更改。

#### 实例

以下代码片段提供了使用`Statement`对象的批量更新示例 -

```sql
// Create statement object
Statement stmt = conn.createStatement();

// Set auto-commit to false
conn.setAutoCommit(false);

// Create SQL statement
String SQL = "INSERT INTO Employees (id, first, last, age) " +
             "VALUES(200,'Ruby', 'Yang', 30)";
// Add above SQL statement in the batch.
stmt.addBatch(SQL);

// Create one more SQL statement
String SQL = "INSERT INTO Employees (id, first, last, age) " +
             "VALUES(201,'Java', 'Lee', 35)";
// Add above SQL statement in the batch.
stmt.addBatch(SQL);

// Create one more SQL statement
String SQL = "UPDATE Employees SET age = 35 " +
             "WHERE id = 100";
// Add above SQL statement in the batch.
stmt.addBatch(SQL);

// Create an int[] to hold returned values
int[] count = stmt.executeBatch();

//Explicitly commit statements to apply changes
conn.commit();
SQL
```

### 使用PrepareStatement对象进行批处理

以下是使用`PrepareStatement`对象进行批处理的典型步骤顺序 -

- 使用占位符创建SQL语句。
- 使用`prepareStatement()`方法创建`PrepareStatement`对象。
- 使用`setAutoCommit()`将自动提交设置为`false`。
- 使用`addBatch()`方法在创建的`Statement`对象上添加SQL语句到批处理中。
- 在创建的`Statement`对象上使用`executeBatch()`方法执行所有SQL语句。
- 最后，使用`commit()`方法提交所有更改。

以下代码段提供了使用`PreparedStatement`对象进行批量更新的示例 -

```java
// Create SQL statement
String SQL = "INSERT INTO Employees (id, first, last, age) " +
             "VALUES(?, ?, ?, ?)";

// Create PrepareStatement object
PreparedStatemen pstmt = conn.prepareStatement(SQL);

//Set auto-commit to false
conn.setAutoCommit(false);

// Set the variables
pstmt.setInt( 1, 400 );
pstmt.setString( 2, "JDBC" );
pstmt.setString( 3, "Li" );
pstmt.setInt( 4, 33 );
// Add it to the batch
pstmt.addBatch();

// Set the variables
pstmt.setInt( 1, 401 );
pstmt.setString( 2, "CSharp" );
pstmt.setString( 3, "Liang" );
pstmt.setInt( 4, 31 );
// Add it to the batch
pstmt.addBatch();

//Create an int[] to hold returned values
int[] count = stmt.executeBatch();

//Explicitly commit statements to apply changes
conn.commit();
```



## 事务

### 事务的四大属性

**原子性**：一组事务中的操作要么全部执行，要么一个都不执行。银行转账例子中，要么A账户减少和B账户增加都执行，要么你都不要执行。你要是不小心只执行了一个，那就很成问题啊小朋友！

**一致性**：事务完成后，必须所有的数据都保持一致。在银行转账例子中，参与转账的两个账户的余额总和在转账前后是一致的，你想想，是不是这个道理。

**隔离性**：事务独立运行，而且是100%独立，两个并发事务不可能同时对同一个数据进行操作。还是以银行转账为例子，这回在增加一个C，A和C同时给B转账，A转100，C转200如果同时操作，B的账户上突然一下子多了300元，那B怎么知道这300是谁转的，谁转了多少，这更麻烦了！

**持久性**：事务完成后，对系统的影响是持久的。这个很好理解了，A给B转了钱，那么这笔转账操作永远有效。如果今天有效，明天没效，岂不是很难过。



> 如果JDBC连接处于自动提交模式，默认情况下，则每个SQL语句在完成后都会提交到数据库。
>
> 对于简单的应用程序可能没有问题，但是有三个原因需要考虑是否关闭自动提交并管理自己的事务 -
>
> - 提高性能
> - 保持业务流程的完整性
> - 使用分布式事务

事务能够控制何时更改提交并应用于数据库。 它将单个SQL语句或一组SQL语句视为一个逻辑单元，如果任何语句失败，整个事务将失败。

要启用手动事务支持，而不是使用JDBC驱动程序默认使用的自动提交模式，请调用`Connection`对象的`setAutoCommit()`方法。 如果将布尔的`false`传递给`setAutoCommit()`，则关闭自动提交。 也可以传递一个布尔值`true`来重新打开它。

例如，如果有一个名为`conn`的`Connection`对象，请将以下代码关闭自动提交 -

```java
conn.setAutoCommit(false);
Java
```

### 提交和回滚

完成更改后，若要提交更改，那么可在连接对象上调用`commit()`方法，如下所示：

```java
conn.commit( );
```

否则，要使用连接名为`conn`的数据库回滚更新，请使用以下代码 -

```java
conn.rollback( );
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
```

在这种情况下，上述`INSERT`语句不会成功执行，因为所有操作都被回滚了。



### 使用保存点

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
```

可以看到，上面代码中只回滚到保存点(ROWS_DELETED_1)，所以ID为`106`的这一行记录没有被删除，而ID为`107`的记录因为没有设置回滚点，直接提交删除了。

## 数据库连接池

### 实现数据库连接池接口

```java
package com.neuedu.jdbc;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;
import java.util.LinkedList;
import java.util.Properties;
import java.util.logging.Logger;

public class MyDataSource implements DataSource {

    private String url;
    private String password;
    private String username;
    private int poolSize;
    private LinkedList<Connection> pool = new LinkedList<>();

    static {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }


    public MyDataSource() {
        InputStream in = MyDataSource.class.getClassLoader().getResourceAsStream("db.properties");
        Properties properties = new Properties();
        try {
            properties.load(in);
            url = properties.getProperty("jdbc.url");
            username = properties.getProperty("jdbc.username");
            password = properties.getProperty("jdbc.password");
            poolSize = 10;
            initPool(poolSize, url, username, password);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void initPool(int poolSize, String url, String username, String password) {
        for (int i = 0; i < poolSize; i++) {
            try {
                pool.addLast(DriverManager.getConnection(url, username, password));
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public MyDataSource(String url, String password, String username, int poolSize) {
        this.url = url;
        this.password = password;
        this.username = username;
        this.poolSize = poolSize;
        initPool(poolSize, url, username, password);

    }

    @Override
    public Connection getConnection() throws SQLException {
        synchronized (pool) {
            if (pool.size() <= 0) {
                try {
                    pool.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return getConnection();
            } else {
                Connection conn = pool.removeFirst();
                Object obj = Proxy.newProxyInstance(MyDataSource.class.getClassLoader(),
                    new Class[]{Connection.class},
                        (proxy, method, args) -> {
                            if (method.getName().equals("close")) {
                                synchronized (pool) {
                                    pool.add(conn);
                                    pool.notify();
                                    return null;
                                }
                            } else {
                                return method.invoke(conn, args);
                            }
                        });
                System.out.println("has conn is :"+pool.size());
                return (Connection) obj;
            }
        }
    }


    @Override
    public Connection getConnection(String username, String password) throws SQLException {
        return null;
    }

    @Override
    public <T> T unwrap(Class<T> iface) throws SQLException {
        return null;
    }

    @Override
    public boolean isWrapperFor(Class<?> iface) throws SQLException {
        return false;
    }

    @Override
    public PrintWriter getLogWriter() throws SQLException {
        return null;
    }

    @Override
    public void setLogWriter(PrintWriter out) throws SQLException {

    }

    @Override
    public void setLoginTimeout(int seconds) throws SQLException {

    }

    @Override
    public int getLoginTimeout() throws SQLException {
        return 0;
    }

    @Override
    public Logger getParentLogger() throws SQLFeatureNotSupportedException {
        return null;
    }

}

```

### 常用数据库连接池库的使用

HikariCP，druid ，bonecp，c3p0等

参考：http://baijiahao.baidu.com/s?id=1599699339020031595&wfr=spider&for=pc