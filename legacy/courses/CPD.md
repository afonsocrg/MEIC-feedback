# Computação Paralela e Distribuída

Fenix: [Pre-MEPP](https://fenix.tecnico.ulisboa.pt/cursos/meic-a/disciplina-curricular/283003985068072) | [Pos-MEPP](https://fenix.tecnico.ulisboa.pt/cursos/meic-a/disciplina-curricular/564478961778795)

---
Históricamente, esta cadeira sobre algoritmos paralelos tem dificuldade em arranjar bons problemas para paralelizar.
Há uns anos tentaram meter o sudoku paralelo (hint: dá merda, e todas as formas série são mais rápidas). Este ano, a parte "paralela" era o ser uma árvore, fora isso tinha muito pouco.
Em termos daquilo que ensinam (OpenMP e MPI) são coisas antiquíssimas.
O OpenMP foi completamente ultrapassado por coisas de work-stealing threadpools (see: rayon or Cilk).
O MPI não conheço propriamente substitutos. Contudo, o meio parece ter avançado para soluções mais especializadas, mas ainda relevantes e genéricas.
Em particular, é criminoso não ser abordado MapReduce. Eu pessoalmente defendo penas de prisão. Há décadas de investigação (e prática de indústria) sobre este tipo de abordagens, que são ideias que generalizam para além de coisas básicas de "queremos escalar isto". O MPI é uma cena demasiado flexivel para escalar como deve de ser (aside: o nosso projeto sem MPI fazia 4 alocações, com MPI fazia 50K, what's up with that).
Fiz a cadeira numa lógica de "vai ser um merda, mas eu conheço a merda e por isso dá pouco trabalho". Fazer CMU ou CNV acredito que seria igualmente mau, mas não conheço tão bem.

---
Eu diria que a organização da cadeira não é a melhor.
O nosso projeto não tinha o algoritmo mais fácil de paralelizar
Para a parte 1 que tens de usar OpenMP tivemos bué tempo e aquilo não era assim tão complicado.
Para a parte 2 tivemos de usar MPI e para além de termos bem menos tempo ainda pediam uma versão para casos muito grandes (e isso era quase um projeto novo). Depois para testar isto tem de se usar o cluster, e aquilo enche imenso a poucos dias da entrega. A solução do stor foi "acabem mais cedo" -_-
Outro fator que não me fez gostar muito da cadeira foi o facto destas duas partes serem no mesmo algoritmo. Percebo que seja a melhor maneira de comparar as duas approachs, mas tornou-se bastante chato quando chegámos ao MPI (pelo menos para mim já estava farto de ver aquele código)
De resto a cadeira não é má. Só não sei é se recomendo
