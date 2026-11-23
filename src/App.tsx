import { createElement, useEffect, useMemo, useState } from "react";

type IconName = "arrow" | "book" | "cube" | "menu" | "reset" | "spark" | "x";
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" /><path d="M8 7h8M8 11h6" /></>,
    cube: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.7 7.5 4.2 7.5-4.2M12 12v9" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    reset: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>,
    spark: <><path d="m12 3-1.2 4.1a5 5 0 0 1-3.4 3.4L3 12l4.4 1.5a5 5 0 0 1 3.4 3.4L12 21l1.2-4.1a5 5 0 0 1 3.4-3.4L21 12l-4.4-1.5a5 5 0 0 1-3.4-3.4L12 3Z" /></>,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const eras = [
  {
    year: "c. 550 CE", short: "Chaturanga", place: "Northern India", title: "An army becomes a board",
    text: "The earliest recognizable ancestor of chess emerged in India. Its name—Chaturanga, “four divisions”—evoked infantry, cavalry, elephants and chariots. Those military roles survive in the pawn, knight, bishop and rook.",
    detail: "The exact birthplace is debated, but literary and material evidence places a mature form of the game in India by the 6th century.",
    piece: "♞"
  },
  {
    year: "c. 600–700", short: "Shatranj", place: "Sasanian Persia", title: "The game crosses an empire",
    text: "In Persia, Chaturanga became Chatrang and then Shatranj. Courtly play deepened into a studied art, with composed positions called mansubat and masters celebrated for strategic skill.",
    detail: "The language travelled too: shah, “king,” shaped the word check; shah mat is the source of checkmate.",
    piece: "♜"
  },
  {
    year: "c. 800–1000", short: "The Caliphates", place: "Baghdad & beyond", title: "A science of play",
    text: "Across the Islamic world, scholars recorded openings, endgames and player rankings. Trade, diplomacy and conquest carried the board west through North Africa and into medieval Europe.",
    detail: "Shatranj was slower than modern chess: the ancestor of the queen moved only one diagonal square.",
    piece: "♝"
  },
  {
    year: "c. 1000–1450", short: "Medieval Europe", place: "Mediterranean to the north", title: "Pieces enter a new society",
    text: "European players reimagined the pieces through their own social world. The vizier became a queen, the elephant became a bishop in English, and manuscripts made chess a mirror for ethics, rank and courtly life.",
    detail: "Names varied by culture: the same piece could be understood as elephant, runner, fool or bishop.",
    piece: "♛"
  },
  {
    year: "c. 1475", short: "The New Chess", place: "Spain & Italy", title: "The queen transforms the game",
    text: "New rules gave the queen and bishop their long-range power. The faster, more tactical game spread rapidly in print and is recognizably the chess played today.",
    detail: "Historians sometimes call this “mad queen chess”—a dramatic rules revolution rather than a single inventor’s creation.",
    piece: "♕"
  },
  {
    year: "1886 → now", short: "The World Game", place: "A global arena", title: "One board, millions of minds",
    text: "The first generally recognized World Championship was held in 1886. FIDE was founded in Paris in 1924. Clocks, standardized notation, engines and online play have since made an ancient war game a global language.",
    detail: "The Staunton pattern, introduced in 1849, became the international visual standard for tournament pieces.",
    piece: "♚"
  },
] as const;

const inspirations = [
  { title: "Call of Duty", tag: "Squad tactics", text: "Specialized roles, reconnaissance, terrain and coordinated movement echo the logic of divided armies—without claiming a direct lineage.", pos: "crop-0" },
  { title: "God of War", tag: "Mythic warfare", text: "Ancient cosmologies become explorable worlds, translating epic conflict and divine weapons into modern action.", pos: "crop-1" },
  { title: "Raji: An Ancient Epic", tag: "Indian mythology", text: "Nodding Heads Games draws on Hindu and Balinese mythology, Pahari art and temple architecture for a distinctly Indian heroic journey.", pos: "crop-2" },
  { title: "Pachisi & Chaupar", tag: "Race and fate", text: "Cross-shaped Indian race games joined strategy with cowrie shells or dice—ancestors of later commercial games such as Ludo.", pos: "crop-3" },
  { title: "Xiangqi", tag: "A river at war", text: "Chinese chess stages two armies across a river, with generals, cannons, horses and chariots expressing a different branch of chess history.", pos: "crop-4" },
  { title: "Shakuni’s Dice", tag: "Choice and consequence", text: "The Mahabharata’s fateful dice match makes play a moral instrument: a reminder that games can model ambition, risk and loss.", pos: "crop-5" },
] as const;

const initialBoard = ["♜","♞","♝","♛","♚","♝","♞","♜","♟","♟","♟","♟","♟","♟","♟","♟",..."".padEnd(32).split(""),"♙","♙","♙","♙","♙","♙","♙","♙","♖","♘","♗","♕","♔","♗","♘","♖"];
type Side = "w" | "b";
type Move = { from: number; to: number };
const whitePieces = "♙♘♗♖♕♔";
const blackPieces = "♟♞♝♜♛♚";
const pieceKinds: Record<string, string> = {
  "♙":"p","♟":"p","♘":"n","♞":"n","♗":"b","♝":"b",
  "♖":"r","♜":"r","♕":"q","♛":"q","♔":"k","♚":"k",
};
const pieceNames: Record<string, string> = {
  "♙":"White pawn","♟":"Black pawn","♘":"White knight","♞":"Black knight",
  "♗":"White bishop","♝":"Black bishop","♖":"White rook","♜":"Black rook",
  "♕":"White queen","♛":"Black queen","♔":"White king","♚":"Black king",
};
const pieceValues: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 10000 };

function sideOf(piece: string): Side | null {
  if (whitePieces.includes(piece)) return "w";
  if (blackPieces.includes(piece)) return "b";
  return null;
}

function movesFor(board: string[], from: number): number[] {
  const piece = board[from];
  const side = sideOf(piece);
  const kind = pieceKinds[piece];
  if (!side || !kind) return [];
  const row = Math.floor(from / 8);
  const col = from % 8;
  const moves: number[] = [];
  const add = (nextRow: number, nextCol: number) => {
    if (nextRow < 0 || nextRow > 7 || nextCol < 0 || nextCol > 7) return false;
    const target = nextRow * 8 + nextCol;
    if (!board[target]) {
      moves.push(target);
      return true;
    }
    if (sideOf(board[target]) !== side) moves.push(target);
    return false;
  };

  if (kind === "p") {
    const direction = side === "w" ? -1 : 1;
    const startRow = side === "w" ? 6 : 1;
    const one = (row + direction) * 8 + col;
    if (row + direction >= 0 && row + direction <= 7 && !board[one]) {
      moves.push(one);
      const two = (row + direction * 2) * 8 + col;
      if (row === startRow && !board[two]) moves.push(two);
    }
    for (const offset of [-1, 1]) {
      const nextRow = row + direction;
      const nextCol = col + offset;
      if (nextRow >= 0 && nextRow <= 7 && nextCol >= 0 && nextCol <= 7) {
        const target = nextRow * 8 + nextCol;
        if (board[target] && sideOf(board[target]) !== side) moves.push(target);
      }
    }
  } else if (kind === "n") {
    [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]].forEach(([r,c]) => add(row + r, col + c));
  } else if (kind === "k") {
    for (let r = -1; r <= 1; r++) for (let c = -1; c <= 1; c++) if (r || c) add(row + r, col + c);
  } else {
    const directions: number[][] = [];
    if (kind === "r" || kind === "q") directions.push([1,0],[-1,0],[0,1],[0,-1]);
    if (kind === "b" || kind === "q") directions.push([1,1],[1,-1],[-1,1],[-1,-1]);
    directions.forEach(([r,c]) => {
      for (let distance = 1; distance < 8; distance++) {
        if (!add(row + r * distance, col + c * distance)) break;
      }
    });
  }
  return moves;
}

function allMoves(board: string[], side: Side): Move[] {
  return board.flatMap((piece, from) => sideOf(piece) === side
    ? movesFor(board, from).map((to) => ({ from, to }))
    : []);
}

function playMove(board: string[], move: Move): string[] {
  const next = [...board];
  const piece = next[move.from];
  next[move.to] = piece;
  next[move.from] = "";
  const targetRow = Math.floor(move.to / 8);
  if (pieceKinds[piece] === "p" && (targetRow === 0 || targetRow === 7)) {
    next[move.to] = sideOf(piece) === "w" ? "♕" : "♛";
  }
  return next;
}

function chooseBotMove(board: string[]): Move | null {
  const moves = allMoves(board, "b");
  if (!moves.length) return null;
  return moves
    .map((move) => {
      const captured = board[move.to];
      const moving = board[move.from];
      const row = Math.floor(move.to / 8);
      const col = move.to % 8;
      const center = 7 - (Math.abs(3.5 - row) + Math.abs(3.5 - col));
      const capture = captured ? pieceValues[pieceKinds[captured]] * 10 - pieceValues[pieceKinds[moving]] : 0;
      return { move, score: capture + center * 4 + Math.random() * 18 };
    })
    .sort((a, b) => b.score - a.score)[0].move;
}

function ImageFallback({ className = "" }: { className?: string }) {
  return <div className={`image-fallback ${className}`} role="img" aria-label="Decorative chess pattern"><span>♚</span></div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [era, setEra] = useState(0);
  const [heroError, setHeroError] = useState(false);
  const [galleryError, setGalleryError] = useState(false);
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [turn, setTurn] = useState<Side>("w");
  const [winner, setWinner] = useState<Side | null>(null);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  useEffect(() => {
    if (!document.querySelector('script[data-model-viewer]')) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = asset("assets/model-viewer.min.js");
      script.dataset.modelViewer = "true";
      document.head.appendChild(script);
    }
  }, []);

  const current = eras[era];
  const progress = useMemo(() => `${((era + 1) / eras.length) * 100}%`, [era]);
  const legalTargets = useMemo(() => selected === null ? [] : movesFor(board, selected), [board, selected]);

  useEffect(() => {
    if (turn !== "b" || winner) return;
    const timer = window.setTimeout(() => {
      const move = chooseBotMove(board);
      if (!move) {
        setWinner("w");
        return;
      }
      const capturedKing = board[move.to] === "♔";
      setBoard(playMove(board, move));
      setLastMove(move);
      setMoves((value) => value + 1);
      if (capturedKing) setWinner("b");
      else setTurn("w");
    }, 650);
    return () => window.clearTimeout(timer);
  }, [board, turn, winner]);

  function movePiece(index: number) {
    if (turn !== "w" || winner) return;
    if (selected === null) {
      if (sideOf(board[index]) === "w") setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    if (sideOf(board[index]) === "w") {
      setSelected(index);
      return;
    }
    if (!legalTargets.includes(index)) return;
    const move = { from: selected, to: index };
    const capturedKing = board[index] === "♚";
    setBoard(playMove(board, move));
    setLastMove(move);
    setSelected(null);
    setMoves((value) => value + 1);
    if (capturedKing) setWinner("w");
    else setTurn("b");
  }

  function resetBoard() {
    setBoard(initialBoard);
    setSelected(null);
    setMoves(0);
    setTurn("w");
    setWinner(null);
    setLastMove(null);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand focus-ring" href="#top" aria-label="Chess Evolution home">
          <span className="brand-mark">♞</span><span>CHESS <i>EVOLUTION</i></span>
        </a>
        <button className="menu-button focus-ring" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? "Close menu" : "Open menu"}>
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>
        <nav id="main-nav" className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          {["Origins", "Timeline", "Artifact", "Play", "Influence"].map((item) => <a className="focus-ring" key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
        </nav>
      </header>

      <section id="top" className="hero">
        {!heroError ? <img className="hero-image" src={asset("assets/chess-king-hero.png")} alt="An ornate king standing on an ancient stone chessboard" onError={() => setHeroError(true)} /> : <ImageFallback className="hero-fallback" />}
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow"><span /> An interactive chronicle</div>
          <h1>64 squares.<br /><em>1,500 years.</em></h1>
          <p>Journey from the battlefields of ancient India to the most universal strategy game on Earth.</p>
          <div className="hero-actions">
            <a className="button button-primary focus-ring" href="#timeline">Begin the journey <Icon name="arrow" /></a>
            <a className="text-link focus-ring" href="#artifact"><Icon name="cube" /> Explore the artifact</a>
          </div>
        </div>
        <a href="#origins" className="scroll-cue focus-ring" aria-label="Scroll to origins"><span>Scroll to explore</span><i /></a>
        <div className="hero-stat"><strong>6th</strong><span>century CE<br />earliest origins</span></div>
      </section>

      <section id="origins" className="section origins">
        <div className="section-number">01</div>
        <div className="origin-heading">
          <p className="kicker">Before kings and queens</p>
          <h2>A battlefield,<br />made <em>miniature.</em></h2>
        </div>
        <div className="origin-copy">
          <p className="lead">Chess did not arrive fully formed. It moved with merchants, scholars and empires—adapting to every culture that touched it.</p>
          <p>Most historians trace its recognizable ancestor to <strong>Chaturanga</strong>, played in India around the 6th century CE. The board represented an army’s four divisions: foot soldiers, horses, elephants and chariots.</p>
          <div className="army-key">
            {[["♙","Padāti","Infantry"],["♘","Aśva","Cavalry"],["♗","Gaja","Elephants"],["♖","Ratha","Chariots"]].map(([piece, old, modern]) => <div key={old}><span>{piece}</span><strong>{old}</strong><small>{modern}</small></div>)}
          </div>
        </div>
      </section>

      <section id="timeline" className="section timeline">
        <div className="section-intro">
          <div><p className="kicker">The time lens</p><h2>Follow the <em>game.</em></h2></div>
          <p>Select an era to see how a military simulation became a shared cultural language.</p>
        </div>
        <div className="timeline-tabs" role="tablist" aria-label="Chess history eras">
          {eras.map((item, index) => <button key={item.short} role="tab" aria-selected={era === index} aria-controls="era-panel" className={`focus-ring ${era === index ? "active" : ""}`} onClick={() => setEra(index)}><span>{String(index + 1).padStart(2,"0")}</span>{item.short}</button>)}
        </div>
        <div className="timeline-track" aria-hidden="true"><i style={{ width: progress }} />{eras.map((_, index) => <button tabIndex={-1} key={index} className={era >= index ? "passed" : ""} onClick={() => setEra(index)} />)}</div>
        <article id="era-panel" className="era-panel" role="tabpanel">
          <div className="era-piece" aria-hidden="true">{current.piece}</div>
          <div className="era-date"><span>{current.year}</span><small>{current.place}</small></div>
          <div className="era-story">
            <p className="kicker">Chapter {String(era + 1).padStart(2,"0")}</p>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
            <aside><Icon name="spark" /><span><strong>History note</strong>{current.detail}</span></aside>
          </div>
          <div className="era-controls">
            <button className="focus-ring" disabled={era === 0} onClick={() => setEra(era - 1)} aria-label="Previous era">←</button>
            <span>{era + 1} / {eras.length}</span>
            <button className="focus-ring" disabled={era === eras.length - 1} onClick={() => setEra(era + 1)} aria-label="Next era">→</button>
          </div>
        </article>
      </section>

      <section id="artifact" className="section artifact">
        <div className="artifact-copy">
          <p className="kicker">Artifact room · 3D</p>
          <h2>Turn history<br />in your <em>hands.</em></h2>
          <p>Explore the supplied board model. Drag to rotate and discover how a familiar grid becomes an architectural object.</p>
          <div className="artifact-facts"><div><strong>08 × 08</strong><span>square field</span></div><div><strong>32</strong><span>pieces at play</span></div></div>
          <p className="interaction-note"><span className="pulse" /> Drag the model to rotate</p>
        </div>
        <div className="model-shell">
          {useMemo(() => createElement("model-viewer", {
            src: asset("assets/chess-board.glb"),
            poster: asset("assets/chess-king-hero.png"),
            alt: "Interactive three-dimensional historical chess artifact",
            "camera-controls": true,
            "auto-rotate": true,
            "rotation-per-second": "8deg",
            "interaction-prompt": "auto",
            "shadow-intensity": "1",
            exposure: "0.85",
            loading: "lazy",
            "disable-pan": true,
          }), [])}
          <span className="model-label">Interactive model <i>•</i> GLB</span>
        </div>
      </section>

      <section id="play" className="section play">
        <div className="section-intro">
          <div><p className="kicker">The strategy table</p><h2>Challenge the <em>machine.</em></h2></div>
          <p>You command White. Select a piece to reveal its legal moves; the Black bot studies the position and answers automatically.</p>
        </div>
        <div className="play-layout">
          <div className="board-wrap">
            <div className="player-strip bot"><span className={turn === "b" && !winner ? "thinking-dot" : ""}>♚</span><div><strong>Evolution Bot</strong><small>{turn === "b" && !winner ? "Calculating move…" : "Black · Tactical level"}</small></div></div>
            <div className={`board ${turn === "b" ? "board-locked" : ""}`} role="grid" aria-label="Chessboard: you are White against the computer">
              {board.map((piece, index) => {
                const legal = legalTargets.includes(index);
                const wasMoved = lastMove?.from === index || lastMove?.to === index;
                return <button
                  key={index}
                  role="gridcell"
                  aria-label={`${pieceNames[piece] || "Empty"} square ${String.fromCharCode(97 + index % 8)}${8 - Math.floor(index / 8)}${legal ? ", legal move" : ""}`}
                  aria-pressed={selected === index}
                  className={`focus-ring ${(Math.floor(index / 8) + index) % 2 ? "dark" : "light"} ${selected === index ? "selected" : ""} ${legal ? board[index] ? "legal capture" : "legal" : ""} ${wasMoved ? "last-move" : ""}`}
                  onClick={() => movePiece(index)}
                >{piece}</button>;
              })}
            </div>
            <div className="player-strip human"><span>♔</span><div><strong>You</strong><small>White · Your side</small></div></div>
          </div>
          <aside className="play-aside">
            <p className="kicker">Quick match · You vs bot</p>
            <h3>{winner ? (winner === "w" ? "You conquered the board." : "The machine prevails.") : turn === "w" ? "Your move, strategist." : "The bot is thinking."}</h3>
            <p>Standard piece movement is enabled, with two-square opening pawn moves and automatic queen promotion. Capture the opposing king to win.</p>
            <div className={`game-status ${winner ? "finished" : ""}`} aria-live="polite">
              <span>{winner ? "Match complete" : turn === "w" ? "White to move" : "Black to move"}</span>
              <strong>{winner ? (winner === "w" ? "Victory" : "Defeat") : turn === "w" ? "Your turn" : "Thinking…"}</strong>
            </div>
            <div className="move-counter"><span>Total turns</span><strong>{String(moves).padStart(2,"0")}</strong></div>
            <button className="button button-ghost focus-ring" onClick={resetBoard}><Icon name="reset" /> {winner ? "Play again" : "Restart match"}</button>
          </aside>
        </div>
      </section>

      <section id="influence" className="section influence">
        <div className="section-intro">
          <div><p className="kicker">Echoes of strategy</p><h2>The game <em>continues.</em></h2></div>
          <p>Ancient systems of tactics, myth and chance still shape how modern games create conflict and meaning.</p>
        </div>
        <div className="card-grid">
          {inspirations.map((item, index) => <article className="inspiration-card" key={item.title}>
            <div className={`card-image ${item.pos}`}>
              {!galleryError ? <img src={asset("assets/inspirations-grid.png")} alt="" onError={() => setGalleryError(true)} /> : <ImageFallback />}
              <span>{String(index + 1).padStart(2,"0")}</span>
            </div>
            <div className="card-copy"><small>{item.tag}</small><h3>{item.title}</h3><p>{item.text}</p></div>
          </article>)}
        </div>
      </section>

      <section className="section sources">
        <div><p className="kicker">Read beyond the board</p><h2>A story with<br /><em>many authors.</em></h2></div>
        <div className="source-list">
          <a className="focus-ring" href="https://artsandculture.google.com/story/a-short-history-of-chess-international-chess-federation-fide/KgXBG5vqmqonQw?hl=en" target="_blank" rel="noreferrer"><Icon name="book" /><span><strong>A Short History of Chess</strong><small>FIDE · Google Arts & Culture</small></span><Icon name="arrow" /></a>
          <a className="focus-ring" href="https://www.fide.com/fide/about-fide" target="_blank" rel="noreferrer"><Icon name="book" /><span><strong>About FIDE</strong><small>International Chess Federation</small></span><Icon name="arrow" /></a>
          <a className="focus-ring" href="https://www.britannica.com/topic/chess/History" target="_blank" rel="noreferrer"><Icon name="book" /><span><strong>History of Chess</strong><small>Encyclopaedia Britannica</small></span><Icon name="arrow" /></a>
        </div>
      </section>

      <footer><a className="brand focus-ring" href="#top"><span className="brand-mark">♞</span><span>CHESS <i>EVOLUTION</i></span></a><p>An independent interactive chronicle of the world’s most enduring strategy game.</p><a className="focus-ring" href="#top">Back to top ↑</a></footer>
    </main>
  );
}

export default App;
