package files

import (
	"os"
	"strings"
)

type File struct {
	Name  string `json:"name"`
	IsDir bool   `json:"isDir"`
	Size  int64  `json:"size"`
}

func ListFiles(basePath string, path []string) ([]File, error) {
	root, err := os.OpenRoot(basePath)
	if err != nil {
		return nil, err
	}

	defer root.Close()

	fullPath := "." + string(os.PathSeparator) + strings.Join(path, string(os.PathSeparator))
	targetFolder, err := root.Open(fullPath)

	if err != nil {
		return nil, err
	}

	fileInfos, err := targetFolder.Readdir(0)

	if err != nil {
		return nil, err
	}

	files := []File{}
	for _, fileInfo := range fileInfos {
		files = append(files, File{
			Name:  fileInfo.Name(),
			IsDir: fileInfo.IsDir(),
			Size:  fileInfo.Size(),
		})
	}

	return files, nil
}
