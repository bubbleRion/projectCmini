
// mysql 가져오기
const mysql = require("mysql")
// db 정보 저장된 js 연결
const conn = require("./myCON.js")
// path 가져오기
const path = require("path")
// express 가져오기
const express = require("express")
// express 호출해서 app에 담아주기
const app = express();
// const cors = require("cors")
// const fs = require("fs");

// 포트번호 세팅
app.set('port', process.env.PORT || 8000);

// 디비와의 연결
const db = mysql.createConnection(conn);

// 익스프레스 바디파서 사용

app.use(express.json())
app.use(express.urlencoded({extended : true}))

const localVariable = {
  realCount: 0,
  deleteCurrent : 0,
}

// realcount는 seq다음 번호를 만들어서 다음 게시글에 번호중첩이 되지 않고 실행되게끔 한다.
let realCount = 0;
// current는 수정, 삭제할때 일치하게끔 사용한다.
let current = 0;
// 배열을 담는 result
let result = "";
// 검색기록 추가
let searchPastLog = []
// 처음 접속 사이트, 게시판 DB에 있는 목록들을 전부 가져와 화면에 출력한다.
app.get("/", (req, res)=>{
  
  // db.query를 사용하여 mysql구문을 사용할 수 있게하고, err와 results 결과를 읽어온다.
  db.query("select * from mainBoard4", (err, results)=>{
    // err 있으면 err 표시해줘
    if(err){
      console.error(err)
    }
    // realCount의 값을 바꿔준다. 게시물 번호 마지막의 +1
    realCount = (results[results.length - 1].seq +1)
    // results에 map을 돌려서 result라는 변수에 담아준다. map의 반환값은 배열
    result =  results.reverse().map((item, index)=>{
      // html태그형식에 분석한 데이터를 담아서 result에 넣어준다. map이기에 db에 있는 정보들이 정리되어서 담긴다.
      return `<hr><div style="display : flex; justify-content: flex-start; align-items: center; gap: 20px;">
      <a href="board${item.seq}" style="color: black; text-decoration: none;">
      <h3>게시물번호 : ${("0000" + item.seq).slice(-5)}</h3>
      <h1 style=" color : cadetblue; ">제목 : ${item.head}</h1>
      <div style="color: #333;">태그 : ${item.tag}</div>
      <div style="">내용 : ${item.main.slice(0, 20)}...</div>
      </a></div>`
    })
    // result2라는 변수에 화면에 출력되기위해서 배열 형식을 벗어나는 forEach를 돌려준다. join("")으로 대체 가능
    let result2 = ""
    result.forEach((item)=>{
      result2 += item
    })
// 보내준다. 데이터를 담은 html
      res.send(`<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      
      <body>
      <form action="/search" method="get" style="display : flex; justify-content: center; align-items: center; gap: 20px;">
        <input type="text" name="head" placeholder="단어 검색" style="width : 800px; height : 50px; font-size: 24px;"></input><button style="width : 50px; height : 56px;">검색</a></button>
        <div style="width : 800px; height : 50px; font-size: 24px; opacity : 0.5;" >${searchPastLog}</div>
      </form>
        <h1><a href="/create" style="color: pink; text-decoration: none; ">글 생성</a></h1>
        ${result2 === undefined ? "글 준비중...." : result2}
      </body>
      
      </html>`)
  })
})
// 게시물 상세보기 연결 id로 어떤 게시글을 클릭했는지 구분하고 그 주소로 연결 시켜 준다.
app.get("/board:id", (req, res)=>{
  db.query("select * from mainBoard4", (err, results)=>{
    if(err){
      console.error(err)
    }
    // delete, update에 필요한 값
    current = req.params.id;
    let result2 = "";
      results.forEach((item, index)=>{
        result2 = `<div style="display : flex; justify-content: center; align-items: center; gap: 20px; flex-direction: column;">
        <h3>게시물번호 : ${("0000" + item.seq).slice(-5)}</h3>
        <h1 style=" color : cadetblue; width: 700px; height : 20px">제목 : ${item.head}</h1>
        <div style="color: #333; width: 700px; height : 20px">태그 : ${item.tag}</div>
        <div style="width: 700px; height : 500px">내용 : ${item.main}</div>
        </div>`    
        
        if(req.params.id == item.seq){

        res.send(`
        <body>
        <h1><a href="/" style="color: black; text-decoration: none; ">홈으로</a></h1>
          ${result2}
        <h1><a href="/delete" style="color: black; text-decoration: none; ">삭제하기</a></h1>
        <h1><a href="/update" style="color: black; text-decoration: none; ">수정하기</a></h1>
        </body>
        `)
      }
    })     
  })
})


// 게시글 생성 페이지. mainBoard에 있는 form을 통해서 데이터를 입력받으면 post에서 처리한다.
app.get("/create", (req,res)=>{
  res.sendFile(path.join(__dirname, "mainBoard.html"))
})

// 게시글 처리 과정 req로 받아서 디비에 저장을 한다. 
app.post("/create", (req, res)=>{
  let body = req.body
  let headText = body.headText;
  let mainTag = body.mainTag;
  let mainText = body.mainText
  let query = db.query(`insert into mainBoard4(seq, head, tag, main) values("${(realCount)}", "${headText}", "${mainTag}", "${mainText}" );`,  (err)=>{
    if(err){
      console.error(err)
    }
  })
  
  res.redirect("/")
})
// 게시글 삭제 과정. current 변수를 이용해 게시판 번호를 찾아 db에서 처리 해준다.
app.get('/delete', (req, res)=>{
  let sql = `delete from mainBoard4 where seq=${current};`
  db.query(sql, (err, result)=>{
    if(err){
      console.error(err)
    }
    res.redirect("/")
  })
})
// 수정html문서 불러오기
app.get("/update", (req, res)=>{
  res.sendFile(path.join(__dirname, "mainBoardUpdate.html"))
})

// 수정하기
app.post("/update", (req , res)=>{
  let body = req.body
  let headText = body.headText
  let mainTag = body.mainTag
  let mainText = body.mainText

  let sql = `update mainBoard4 set head = "${headText}", tag = "${mainTag}" , main = "${mainText}" where seq =${current};`
  db.query(sql, (err, result)=>{
    if(err){
      console.error(err)
    }
    res.redirect(`/board${current}`)
  })
})

// 검색 구현
// 결과를 req.query.head로 받아온 것과 item.head 즉, 제목부분의 첫 단어나 완전일치했을 경우 출력해준다.
let searchResultMain = []
app.get("/search", (req, res)=>{
  searchPastLog.push(req.query.head)
  db.query(`select * from mainBoard4 where main like "%${req.query.head}%" or head like "%${req.query.head}%" or tag like "%${req.query.head}%";`, (err, results)=>{
    if(err){
      console.error(err)
    }
    if(req.query.head.length > 1){
    let searchResult = [];
      searchResult =  results.reverse().map((item, index)=>{
        searchResultMain.push(`<div style="display : flex; justify-content: flex-start; align-items: center; gap: 20px;">
        <a href="board${item.seq}" style="color: black; text-decoration: none;">
        <h3>게시물번호 : ${("0000" + item.seq).slice(-5)}</h3>
        <h1 style=" color : cadetblue; ">제목 : ${item.head}</h1>
        <div style="color: #333;">태그 : ${item.tag}</div>
        <div style="">내용 : ${item.main.slice(0, 20)}...</div>
        </a></div><hr>`)
      })
    }




    // 나 뭐한거지 검색 로직 구현 하다가 mysql의 기능을 사용하기로 결정. 몰랐다.


    
        // item.main.split(" ").forEach((value)=>{
        //   if(value === req.query.head || item.main === req.query.head){
        //     // console.log(value)
        //     searchResultMain.push(`<div style="display : flex; justify-content: flex-start; align-items: center; gap: 20px;">
        //     <a href="board${item.seq}" style="color: black; text-decoration: none;">
        //     <h3>게시물번호 : ${("0000" + item.seq).slice(-5)}</h3>
        //     <h1 style=" color : cadetblue; ">제목 : ${item.head}</h1>
        //     <div style="color: #333;">태그 : ${item.tag}</div>
        //     <div style="">내용 : ${item.main.slice(0, 20)}...</div>
        //     </a></div><hr>`)
        //   }
        //   else{
        //     return ""
        //   }
        // })

        // item.tag.split(" ").forEach((value)=>{
        //   if(value === req.query.head || item.tag === req.query.head){
        //     // console.log(value)
        //     searchResultMain.push(`<div style="display : flex; justify-content: flex-start; align-items: center; gap: 20px;">
        //     <a href="board${item.seq}" style="color: black; text-decoration: none;">
        //     <h3>게시물번호 : ${("0000" + item.seq).slice(-5)}</h3>
        //     <h1 style=" color : cadetblue; ">제목 : ${item.head}</h1>
        //     <div style="color: #333;">태그 : ${item.tag}</div>
        //     <div style="">내용 : ${item.main.slice(0, 20)}...</div>
        //     </a></div><hr>`)
        //   }
        //   else{
        //     return ""
        //   }
        // })

        // item.head.split(" ").forEach((value)=>{
        //   if(value === req.query.head || item.head === req.query.head){
        //     // console.log(value)
        //     searchResultMain.push(`<div style="display : flex; justify-content: flex-start; align-items: center; gap: 20px;">
        //     <a href="board${item.seq}" style="color: black; text-decoration: none;">
        //     <h3>게시물번호 : ${("0000" + item.seq).slice(-5)}</h3>
        //     <h1 style=" color : cadetblue; ">제목 : ${item.head}</h1>
        //     <div style="color: #333;">태그 : ${item.tag}</div>
        //     <div style="">내용 : ${item.main.slice(0, 20)}...</div>
        //     </a></div><hr>`)
        //   }
        //   else{
        //     return ""
        //   }
        // })
        
        // 글자검색 로직 제목부분

        // item.head.split("").forEach((value)=>{
        //   if(value === req.query.head  && req.query.head !== ""){
        //     searchResultMain.push(`<div style="display : flex; justify-content: flex-start; align-items: center; gap: 20px;">
        //     <a href="board${item.seq}" style="color: black; text-decoration: none;">
        //     <h3>게시물번호 : ${("0000" + item.seq).slice(-5)}</h3>
        //     <h1 style=" color : cadetblue; ">제목 : ${item.head}</h1>
        //     <div style="color: #333;">태그 : ${item.tag}</div>
        //     <div style="">내용 : ${item.main.slice(0, 20)}...</div>
        //     </a></div><hr>`)
        //   }
        //   else{
        //     return ""
        //   }
        // })
        
        
      
      
    
    // 검색기능을 구현했지만 본문 검색을 구현하지 못했다.
    // 제목의 첫글자와 제목 내용이 완전일치하면 그 값을 반환해서 출력해주었다.

    let searchResult2 = ""
    // console.log(searchResultMain)

    // 중복제거 후 게시판에 출력
    // 변수명은 나중에 고칠것
    const set = new Set(searchResultMain)
    let searchResultMain2 = [...set]
    searchResultMain2.forEach((item)=>{
      searchResult2 += item
    })


    res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    
    <body>
    <form action="/search" method="get" style="display : flex; justify-content: center; align-items: center; gap: 20px;">
        <input type="text" name="head" placeholder="단어 검색" style="width : 800px; height : 50px; font-size: 24px"></input><button style="width : 50px; height : 56px">검색</a></button>
        <div style="width : 800px; height : 50px; font-size: 24px; opacity : 0.5;" >${searchPastLog.join(" ")}</div>
      </form>
      <h1><a href="/" style="color: pink; text-decoration: none; ">홈으로</a></h1>
      <div style="color: cadetblue; text-decoration: none; font-size: 32px">검색결과</div>
      ${searchResult2 === "" ? "<h1>검색 결과가 없네요!</h1>" : searchResult2}
    </body>
    
    </html>`)
    // console.log(searchResult)
    // 정보 초기화
    searchResult = []
    searchResult2 = ""
    searchResultMain = []
    if(searchPastLog.length > 1){
      let dummy = searchPastLog.shift()
    }
  })
})

// db바닐라 형태로 화면에 출력 이제는 안쓰임
app.get('/users', (req, res)=>{
  let sql = "select * from mainBoard4;"
  db.query(sql, (err, result)=>{
    if(err){
      console.error(err)
    }
    res.send(result);
  })
})

// 임시로 쓰는 주석들



// app.get('/delete2', (req, res)=>{
//   let sql = `delete from mainBoard4 where tag="멍멍";`
//   db.query(sql, (err, result)=>{
//     if(err){
//       console.error(err)
//     }
//     res.redirect("/")
//   })
// })

// app.get('/addd', (req, res)=>{
//   let sql = "desc mainBoard4;"
//   db.query(sql, (err, result)=>{
//     if(err){
//       console.error(err)
//     }
//     res.send(result);
//   })
// })

// app.get('/add', (req, res)=>{
//   let sql = `CREATE TABLE mainBoard4(seq INT, head VARCHAR(40), tag VARCHAR(40), main VARCHAR(400) );`
//   db.query(sql, (err, result)=>{
//     if(err){
//       console.error(err)
//     }
//     res.send(result);
//   })
// })

// 서버를 연다.
app.listen(app.get("port"), ()=>{
  console.log('Express and MySql http://localhost:' + app.get("port"))
})