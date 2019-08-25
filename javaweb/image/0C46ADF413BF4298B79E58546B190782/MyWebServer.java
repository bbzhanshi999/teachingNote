package webserver;

import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.ServerSocket;
import java.net.Socket;

public class MyWebServer {

	public static void main(String[] args) throws Exception{
		ServerSocket ss = new ServerSocket(9999);
		Socket socket = ss.accept();
		
		PrintStream out = new PrintStream(socket.getOutputStream());
		InputStreamReader in = new InputStreamReader(new FileInputStream("f:/page/1.html"));
		
		char[] buffer = new char[2048];
		int len = -1;
		
		StringBuilder sb = new StringBuilder();
		
		while((len = in.read(buffer))!=-1){
			sb.append(buffer,0,len);
		}
		
		out.println("HTTP/1.1 200 OK");
		out.println("Content-Type:text/html;charset:UTF-8");
		out.println();
		out.print(sb.toString());
	
		out.flush();
		out.close();
		in.close();
		socket.close();
		ss.close();
	
	}
}
