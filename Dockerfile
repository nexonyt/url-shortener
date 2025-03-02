services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    networks:
      - mynetwork

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - mynetwork

networks:
  mynetwork:
    driver: bridge

