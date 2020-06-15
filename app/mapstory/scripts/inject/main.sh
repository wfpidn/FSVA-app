#!/bin/bash

cd "$(dirname "$0")"

go() {
    echo python main.py "$1" "$2"
    python main.py "$1" "$2"
}

go jatim_en.html ../../stories/jatim/story.en.json
go jatim_id.html ../../stories/jatim/story.id.json

go ntb_en.html ../../stories/ntb/story.en.json
go ntb_id.html ../../stories/ntb/story.id.json

go ntt_en.html ../../stories/ntt/story.en.json
go ntt_id.html ../../stories/ntt/story.id.json

go papua_en.html ../../stories/papua/story.en.json
go papua_id.html ../../stories/papua/story.id.json
