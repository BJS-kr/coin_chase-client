package main

import (
	"bytes"
	"changeme/protodef"
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"log/slog"
	"net"
	"net/http"
	"strconv"

	"github.com/golang/snappy"
	"google.golang.org/protobuf/proto"
)

const (
	SERVER_IP         string = "127.0.0.1"
	SERVER_LOGIN_PORT int    = 8888
)

var (
	PACKET_TYPE_STATUS = []byte{0}
	PACKET_TYPE_ATTACK = []byte{1}
)

var serverPort int
var userId string
var listener *net.TCPListener
var conn *net.TCPConn
var userRelatedPositions *protodef.RelatedPositions
var receiveStarted bool

type Item struct {
	Id     string
	Name   string
	Amount int32
}
type Position struct {
	X int32
	Y int32
}
type ClientStatus struct {
	ID              string
	CurrentPosition *Position
}

type ClientAttack struct {
	UserId         string
	UserPosition   *Position
	AttackPosition *Position
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) SetId(id string) {
	userId = id
}

func (a *App) SetRelatedPositions(relatedPositions *protodef.RelatedPositions) {
	userRelatedPositions = relatedPositions
}
func (a *App) GetRelatedPositions() *protodef.RelatedPositions {
	return userRelatedPositions
}

func (a *App) GetId() string {
	return userId
}
func (a *App) SetServerPort(port int) {
	serverPort = port
}

func (a *App) LogIn(userId string) int {
	// 아무 빈 포트에 할당한다.
	addr, err := net.ResolveTCPAddr("tcp", ":0")

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	listener, err = net.ListenTCP("tcp", addr)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	clientPort := listener.Addr().(*net.TCPAddr).Port

	workerResp, err := http.Get(fmt.Sprintf("http://%s:%d/get-worker-port/%s/%d", SERVER_IP, SERVER_LOGIN_PORT, userId, clientPort))

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	defer workerResp.Body.Close()

	workerPort, err := io.ReadAll(workerResp.Body)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	port, err := strconv.Atoi(string(workerPort))

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	serverAddr, err := net.ResolveTCPAddr("tcp", fmt.Sprintf("%s:%d", SERVER_IP, port))

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	conn, err = net.DialTCP("tcp", nil, serverAddr)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	a.SetId(userId)

	return port
}

func (a *App) StartUpdateMapStatus() {
	if receiveStarted {
		return
	}
	receiveStarted = true
	go func() {
		conn, err := listener.AcceptTCP()

		if err != nil {
			log.Fatal("failed to accept tcp")
		}

		buffer := make([]byte, 4096)
		queueBuffer := bytes.NewBuffer(nil)
		for {
			amount, err := conn.Read(buffer)
			if err != nil {
				if errors.Is(err, io.EOF) {
					log.Fatal(err.Error())
				}
				continue
			}

			queueBuffer.Write(buffer[:amount])

			for {
				data, err := queueBuffer.ReadBytes('$')

				if err != nil {
					if errors.Is(err, io.EOF) {
						queueBuffer.Write(data)
						break
					} else {
						log.Fatal("ReadBytes returned error other than EOF(unexpected)", err.Error())
					}
				}

				decompressed, err := snappy.Decode(nil, buffer[:amount])

				if err != nil {
					slog.Debug(err.Error())
				}

				relatedPositions := &protodef.RelatedPositions{}

				if l := len(decompressed); l > 0 {
					if err := proto.Unmarshal(decompressed[:l-1], relatedPositions); err != nil {
						log.Fatal("TCP unmarshal failed\n" + err.Error())
					}
				}

				a.SetRelatedPositions(relatedPositions)
			}
		}
	}()
}

func (a *App) SendStatus(clientStatus ClientStatus) {
	status := protodef.Status{
		Id: clientStatus.ID,
		CurrentPosition: &protodef.Position{
			X: clientStatus.CurrentPosition.X,
			Y: clientStatus.CurrentPosition.Y,
		},
	}

	data, err := proto.Marshal(&status)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	sendPacket(PACKET_TYPE_STATUS, data)
}

func (a *App) SendAttack(clientAttack ClientAttack) {
	attack := protodef.Attack{
		UserId: clientAttack.UserId,
		UserPosition: &protodef.Position{
			X: clientAttack.UserPosition.X,
			Y: clientAttack.UserPosition.Y,
		},
		AttackPosition: &protodef.Position{
			X: clientAttack.AttackPosition.X,
			Y: clientAttack.AttackPosition.Y,
		},
	}

	data, err := proto.Marshal(&attack)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	sendPacket(PACKET_TYPE_ATTACK, data)
}

func sendPacket(packetType []byte, data []byte) {
	data = append(data, '$')
	_, err := conn.Write(packetType)
	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}
	_, err = conn.Write(data)
	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}
}
