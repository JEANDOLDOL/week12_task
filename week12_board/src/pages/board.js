import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Container,
  Button,
  Alert,
  Form,
} from "react-bootstrap";
import { useAuth } from "../AuthContext";

// 랜덤한 파스텔톤 색상을 생성하는 함수
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};

function Board() {
  const { token } = useAuth(); // 토큰 가져오기
  const [articles, setArticles] = useState([]); // 게시글 상태 관리
  const [warning, setWarning] = useState(""); // 경고 메시지 상태 관리
  const [editingId, setEditingId] = useState(null); // 현재 수정 중인 게시글 ID
  const [editedTitle, setEditedTitle] = useState(""); // 수정된 제목 상태
  const [editedContent, setEditedContent] = useState(""); // 수정된 본문 상태

  // 로그인된 사용자 ID를 토큰에서 추출 (서버에서 토큰 구조에 따라 수정 필요)
  const loggedInUserId = token ? token.userId : null;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/articles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setArticles(data); // 게시글 데이터 설정
      } catch (error) {
        console.error("Failed to fetch articles", error);
      }
    };

    if (token) {
      fetchArticles(); // 토큰이 있을 때만 게시글을 가져옴
    }
  }, [token]);

  // 게시글을 3개씩 나누는 함수
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const articleChunks = chunkArray(articles, 3); // 게시글을 3개씩 나눔

  // 수정 버튼 클릭 핸들러
  const handleEdit = (article) => {
    setEditingId(article.id); // 수정 중인 게시글 ID 설정
    setEditedTitle(article.title); // 기존 제목을 수정 상태에 반영
    setEditedContent(article.post); // 기존 본문을 수정 상태에 반영
  };

  // 저장 버튼 클릭 핸들러
  // 클라이언트에서 id 값을 전송하지 않고, 서버에서 MongoDB의 ObjectId를 자동으로 사용
  const handleSave = async (articleId) => {
    try {
      const response = await fetch(`/articles/${articleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editedTitle,
          post: editedContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the article");
      }

      const updatedArticle = await response.json();

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === articleId
            ? {
                ...article,
                title: updatedArticle.title,
                post: updatedArticle.post,
              }
            : article
        )
      );

      setEditingId(null);

      // 페이지 새로고침
      window.location.reload(); // 저장 후 페이지 새로고침
      alert("수정 완료~");
    } catch (error) {
      console.error("Error updating the article:", error);
      setWarning("게시글 수정에 실패했습니다.");
    }
  };

  // 삭제 버튼 클릭 핸들러
  const handleDelete = async (articleId, articleAuthorId) => {
    if (loggedInUserId === articleAuthorId) {
      try {
        // 서버에 DELETE 요청 보내기
        const response = await fetch(`/articles/${articleId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete the article");
        }

        // 삭제 후 게시글 목록을 다시 로드
        window.location.reload(); // 저장 후 페이지 새로고침
        alert("삭제 완료~");
      } catch (error) {
        console.error("Error deleting the article:", error);
        setWarning("게시글 삭제에 실패했습니다~");
      }
    } else {
      setWarning("올바른 사용자가 아닙니다~"); // 경고 메시지 설정
    }
  };

  return (
    <Container style={{ width: "70%", paddingTop: "100px" }}>
      {warning && <Alert variant="danger">{warning}</Alert>}
      {articleChunks.map((chunk, idx) => (
        <Row key={idx}>
          {chunk.map((article) => (
            <Col key={article.id} sm={4}>
              <Card className="mb-3" style={{ minHeight: "300px" }}>
                <Card.Header
                  style={{ backgroundColor: getRandomPastelColor() }}
                >
                  {article.author}
                </Card.Header>
                <Card.Body
                  style={{
                    backgroundColor: "white", // 본문 배경 흰색 설정
                    minHeight: "200px", // 카드 박스 크기 증가
                    padding: "20px",
                  }}
                >
                  {editingId === article.id ? (
                    <>
                      {/* 제목과 내용 수정 입력창 */}
                      <Form.Group controlId="formTitle">
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formContent">
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                        />
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Card.Title
                        style={{
                          backgroundColor: "white", // 글 제목 배경 흰색 설정
                          padding: "10px",
                          border: "1px",
                        }}
                      >
                        {article.title}
                      </Card.Title>
                      <Card.Text
                        style={{
                          backgroundColor: "white", // 글 제목 배경 흰색 설정
                          padding: "10px",
                        }}
                      >
                        {article.post}
                      </Card.Text>
                    </>
                  )}
                </Card.Body>

                {/* 수정 및 삭제 버튼 */}
                <Card.Footer>
                  {editingId === article.id ? (
                    <Button
                      variant="success"
                      onClick={() => handleSave(article.id)}
                    >
                      저장
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(article)}
                    >
                      수정
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(article.id, article.authorId)}
                    className="ml-2"
                  >
                    삭제
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
}

export default Board;
