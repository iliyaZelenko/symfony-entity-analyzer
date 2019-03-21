Визуализирует энтити вашего Symfony проекта.

![](https://i.imgur.com/7XVzhh8.png)

## Установка

It is assumed that in the root of your project there is a file `package.json`.

```bash
npm install --save-dev symfony-entity-analyzer
# Or if you're using Yarn
yarn add --dev symfony-entity-analyzer
```

## Использование

```bash
npx entity-analyzer
# Or if you're using Yarn
yarn entity-analyzer
```

## --help

```
Options:
  -v, --version      output the version number
  --host [host]      server host (default: "localhost")
  -p, --port [port]  server port (default: 3000)
  -b, --path [path]  path to folder with entity. (defau
lt: "src/Entity")
  --no-open          it won't open your browser.
  -h, --help         output usage information
```

## Как работает

Парсит файлы в дирекории (глубоко), определяет является ли каждый файл энтити.

Алгоритм поиска энтити:
- должен иметь `namespace`
- должен быть классом (не интерфейсом, не трейтом и т.д.)
- должен содержан коммент класса (`leadingComment`)
- в leadingComment должно быть указано что это энтити (`@ORM\Entity` аннотация)

Для найденного класса-энтити проходится по полям (свойствам класса) и находит отношения через парсинг аннртаций.

оддерживаются все 4 вида отношений:
- ManyToOne
- OneToMany
- OneToOne
- ManyToMany

Также поддерживаются самоссылающиеся отношения. Например, `Category` может иметь `children` и `parent`.

## Правила валидности: 

### В `targetEntity` нужно указывать полный `namespace` класса

**Не правильно** 🔴

```php
@ORM\ManyToOne(targetEntity="User")
```

**Правильно** 🔵

```
@ORM\ManyToOne(targetEntity="App\Entity\User")
```

Это чтобы избежать конфликтов.

### Прямо перед комментом с анотацией лучше не писать другой коммент

PHP парсер может не найти нужный коммент свойсива если перед свойством другой коммент.

**Не правильно** 🔴

```php
/* Columns */

/**
 * @ORM\Column(type="text")
 */
private $text;
```

```php
// my comment
/**
 * @ORM\ManyToOne(targetEntity="App\Entity\Post")
 * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
 */
private $post;
```

**Правильно** 🔵

```php
/**
 * @ORM\Column(type="text")
 */
private $text;

/**
 * @ORM\ManyToOne(targetEntity="App\Entity\Post")
 * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
 */
private $post;
```

Это правило не касается комментария над классом.

## Еще скриншоты

Вот еще примеры как может генерировать (каждый раз по новому, хотя это можно отменить через seed):

![](https://i.imgur.com/Qd7toNF.png)
![](https://i.imgur.com/SC5GHCy.png)
![](https://i.imgur.com/FQQiv2N.png)
