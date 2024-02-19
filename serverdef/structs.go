package serverdef

import "time"

type Position struct {
	X int
	Y int
}

type Item struct {
	Id     string
	Name   string
	Amount int
}
type Status struct {
	Id              string
	CurrentPosition Position
	SentAt          time.Time
}
