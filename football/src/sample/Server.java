package sample;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;

public class Server {

    private ServerSocket serverSocket;
    public HashMap<String, String> userMap;

    Server() {
        userMap = new HashMap<>();
        userMap.put("manchester united", "manchester united");
        userMap.put("chelsea", "chelsea");
        userMap.put("manchester city", "manchester city");
        userMap.put("arsenal", "arsenal");
        userMap.put("liverpool", "liverpool");
        try {
            serverSocket = new ServerSocket(33333);
            while (true) {
                Socket clientSocket = serverSocket.accept();
                serve(clientSocket);
            }
        } catch (Exception e) {
            System.out.println("Server starts:" + e);
        }
    }

    public void serve(Socket clientSocket) throws IOException {
        NetworkUtil networkUtil = new NetworkUtil(clientSocket);
        new ReadThreadServer(userMap, networkUtil);
    }

    public static void main(String[] args) {
        new Server();
    }
}
